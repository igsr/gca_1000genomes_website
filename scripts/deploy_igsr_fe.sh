#!/usr/bin/env bash
set -euo pipefail

# Deploy the IGSR front-end to test.internationalgenome.org (dev) or internationalgenome.org (prod).
# This script builds the Docker image from the specified path, pushes it to Google Artifact Registry, and deploys it to Cloud Run.
# Use this when you have made changes to the front-end code and want to see them reflected on the test or production website.
# Use dev to deploy to test.internationalgenome.org and prod to deploy to internationalgenome.org.
# Use --dry-run first to verify the commands that will be executed without making any changes.
#
# Examples:
#   deploy_igsr_fe.sh --path ./gca_1000genomes_website --env dev --dry-run
#   deploy_igsr_fe.sh --path /full/path/to/gca_1000genomes_website --env prod
#
SERVICE="igsr-fe"
REPO="igsr"
REGION="europe-west2"
BUILD_MAX_ATTEMPTS=3
BUILD_RETRY_DELAY_SECONDS=5

WEBSITE_PATH=""
TARGET_ENV=""
BRANCH_NAME="unknown"
MIN_INSTANCES=""
MAX_INSTANCES=""
DRY_RUN=0

log() { printf "\n==> %s\n" "$*"; }
die() { printf "\nERROR: %s\n" "$*" >&2; exit 1; }

usage() {
  cat <<EOF
Usage: $(basename "$0") --path PATH --env {dev|prod} [--dry-run]

Required:
  --path, -p PATH      Path to gca_1000genomes_website
  --env, -e ENV        Deployment environment: dev or prod

Optional:
  --dry-run            Print commands without executing
  -h, --help           Show help

DNS recovery:
  A Docker Hub DNS failure automatically recreates the amd64 Colima profile
  and igsr-builder. This deletes all containers and images in that profile.

Examples:
  $(basename "$0") --path ./gca_1000genomes_website --env dev --dry-run
  $(basename "$0") --path /full/path/to/gca_1000genomes_website --env prod
EOF
}

run() {
  if [ "$DRY_RUN" -eq 1 ]; then
    printf "DRY RUN: "
    printf "%q " "$@"
    printf "\n"
    return 0
  fi
  "$@"
}

run_in_dir() {
  local dir="$1"
  shift

  if [ "$DRY_RUN" -eq 1 ]; then
    printf "DRY RUN: (cd %q && " "$dir"
    printf "%q " "$@"
    printf ")\n"
    return 0
  fi

  (
    cd "$dir"
    "$@"
  )
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Required command not found: $1"
}

is_docker_dns_error() {
  grep -Eqi 'docker\.io' "$1" &&
    grep -Eqi \
      'lookup .*i/o timeout|temporary failure in name resolution|could not resolve host|no such host' \
      "$1"
}

docker_dns_error_help() {
  printf '\nERROR: Docker Hub DNS resolution failed after %s attempts.\n' "$BUILD_MAX_ATTEMPTS" >&2
  printf 'The amd64 Colima profile and BuildKit builder were recreated, but DNS still failed.\n' >&2
  printf 'Check VPN/firewall settings or replace the configured public DNS servers.\n' >&2
}

repair_colima_dns() {
  printf '\nWARNING: Recreating the amd64 Colima profile to repair Docker DNS.\n' >&2
  printf 'All containers and images in that profile will be deleted.\n\n' >&2

  colima stop --profile amd64
  colima delete -f --profile amd64
  colima start --profile amd64 \
    --arch x86_64 \
    --cpu 4 \
    --memory 8 \
    --disk 80 \
    --dns 8.8.8.8 \
    --dns 1.1.1.1

  docker --context colima-amd64 buildx rm igsr-builder 2>/dev/null || true
  docker --context colima-amd64 buildx create \
    --name igsr-builder \
    --driver docker-container \
    --use
  docker --context colima-amd64 buildx inspect --bootstrap

  log "Verifying Docker Hub access"
  docker --context colima-amd64 pull docker/dockerfile:1.6
}

build_and_push_image() {
  local attempt=1
  local build_log
  local dns_repair_attempted=0

  if [ "$DRY_RUN" -eq 1 ]; then
    run_in_dir "$WEBSITE_PATH" \
      docker buildx build \
        --platform linux/amd64 \
        -t "$IMAGE" \
        --no-cache \
        --push \
        .
    return 0
  fi

  while [ "$attempt" -le "$BUILD_MAX_ATTEMPTS" ]; do
    build_log="$(mktemp -t igsr-deploy-build.XXXXXX)"

    if (
      cd "$WEBSITE_PATH"
      docker buildx build \
        --platform linux/amd64 \
        -t "$IMAGE" \
        --no-cache \
        --push \
        . 2>&1 | tee "$build_log"
    ); then
      rm -f "$build_log"
      return 0
    fi

    if ! is_docker_dns_error "$build_log"; then
      rm -f "$build_log"
      die "Docker image build failed"
    fi

    rm -f "$build_log"

    if [ "$dns_repair_attempted" -eq 0 ]; then
      repair_colima_dns
      dns_repair_attempted=1
      attempt=$((attempt + 1))
      continue
    fi

    if [ "$attempt" -eq "$BUILD_MAX_ATTEMPTS" ]; then
      docker_dns_error_help
      return 1
    fi

    printf '\nWARNING: Docker Hub DNS lookup timed out (attempt %s/%s). Retrying in %s seconds...\n' \
      "$attempt" "$BUILD_MAX_ATTEMPTS" "$BUILD_RETRY_DELAY_SECONDS" >&2
    sleep "$BUILD_RETRY_DELAY_SECONDS"
    attempt=$((attempt + 1))
  done
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --path|-p)
        [ "$#" -ge 2 ] || die "Missing value for $1"
        WEBSITE_PATH="$2"
        shift 2
        ;;
      --env|-e)
        [ "$#" -ge 2 ] || die "Missing value for $1"
        TARGET_ENV="$2"
        shift 2
        ;;
      --dry-run)
        DRY_RUN=1
        shift
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      *)
        die "Unknown argument: $1"
        ;;
    esac
  done
}

validate_inputs() {
  [ -n "$WEBSITE_PATH" ] || die "--path is required"
  [ -n "$TARGET_ENV" ] || die "--env is required"
  [ -d "$WEBSITE_PATH" ] || die "Path does not exist: $WEBSITE_PATH"
  [ -f "$WEBSITE_PATH/Dockerfile" ] || die "No Dockerfile found at: $WEBSITE_PATH/Dockerfile"

  WEBSITE_PATH="$(cd "$WEBSITE_PATH" && pwd -P)"

  case "$TARGET_ENV" in
    dev|prod) ;;
    *)
      die "--env must be 'dev' or 'prod' (got: $TARGET_ENV)"
      ;;
  esac
}

set_env_values() {
  case "$TARGET_ENV" in
    dev)
      API_URL="https://test.internationalgenome.org"
      PROJECT_ID="prj-ext-dev-gaa-igsr"
      IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/igsr-fe:dev"
      MIN_INSTANCES="0"
      MAX_INSTANCES="1"
      ;;
    prod)
      API_URL="https://internationalgenome.org"
      PROJECT_ID="prj-ext-prod-gaa-igsr"
      IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REPO/igsr-fe:prod"
      MIN_INSTANCES="1"
      MAX_INSTANCES="2"
      ;;
  esac
}

detect_branch() {
  if ! command -v git >/dev/null 2>&1; then
    BRANCH_NAME="git-not-installed"
    return 0
  fi

  if ! git -C "$WEBSITE_PATH" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    BRANCH_NAME="not-a-git-repo"
    return 0
  fi

  BRANCH_NAME="$(git -C "$WEBSITE_PATH" branch --show-current 2>/dev/null || true)"
  if [ -z "$BRANCH_NAME" ]; then
    BRANCH_NAME="detached-head"
  fi
}

main() {
  parse_args "$@"
  validate_inputs
  set_env_values
  detect_branch

  if [ "$DRY_RUN" -eq 0 ]; then
    need_cmd docker
    need_cmd colima
    need_cmd gcloud
  fi

  log "Deployment plan"
  printf "WEBSITE_PATH=%s\n" "$WEBSITE_PATH"
  printf "TARGET_ENV=%s\n" "$TARGET_ENV"
  printf "BRANCH_NAME=%s\n" "$BRANCH_NAME"
  printf "IMAGE=%s\n" "$IMAGE"
  printf "SERVICE=%s\n" "$SERVICE"
  printf "API_URL=%s\n" "$API_URL"
  printf "MIN_INSTANCES=%s\n" "$MIN_INSTANCES"
  printf "MAX_INSTANCES=%s\n" "$MAX_INSTANCES"

  run docker context use colima-amd64
  run colima start --profile amd64

  run gcloud config set project "$PROJECT_ID"
  run gcloud config set run/region "$REGION"
  run gcloud services enable \
    run.googleapis.com \
    artifactregistry.googleapis.com \
    cloudbuild.googleapis.com

  build_and_push_image

  deploy_args=(
    run deploy "$SERVICE"
    --image "$IMAGE"
    --region "$REGION"
    --concurrency 80
    --memory 512Mi
    --min-instances "$MIN_INSTANCES"
    --max-instances "$MAX_INSTANCES"
    --set-env-vars "API_BASE=$API_URL"
  )

  run gcloud "${deploy_args[@]}"

  log "Done"
}

main "$@"
