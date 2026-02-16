#!/usr/bin/env bash
set -euo pipefail

# IGSR full-stack local site (Colima + Docker)
# - ARM64 Colima: Elasticsearch + API
# - AMD64 Colima: Front-end
# - Builds images, starts containers, and indexes ES via es-py
#
# Requirements
# - macOS with colima installed
# - docker CLI installed (with buildx support)
# - python3 available (for local indexing)
# - network access to the MySQL host in config.ini (e.g., mysql-igsr-web)
# - local clones of gca_1000genomes_website, igsr-be, and es/es-py
# - open ports: 9200 (ES), 8000 (API), 8080 (FE)
# - enough disk/RAM for two Colima VMs (defaults: 12GB ARM64, 8GB AMD64)
#
# Options (CLI flags)
# - --fe-repo PATH     Full path to gca_1000genomes_website repo (required)
# - --be-repo PATH     Full path to igsr-be repo (required)
# - --es-py-repo PATH  Full path to es-py repo (required)
# - --es-config PATH   Full path to es-py config.ini (default: <es-repo>/config.ini)
# - --api-config PATH  Full path to igsr-be .env (default: <be-repo>/.env)
# - --espy-venv-dir PATH  Full path to Python venv for es-py
#                         If not set, the script will:
#                         1) use <es-py>/.venv if it exists,
#                         2) else use <es-py>/espy-env if it exists,
#                         3) else create <script-dir>/.espy-venv
# - --fe-branch NAME   Git branch to checkout for FE (default: current checkout)
# - --be-branch NAME   Git branch to checkout for BE (default: current checkout)
# - --es-branch NAME   Git branch to checkout for ES/es-py (default: current checkout)
# - --fe-api-base URL  FE upstream API base (default: http://host.lima.internal:8000)
# - --fe-platform STR  FE build platform (default: linux/amd64)
# - --network NAME     Docker network for ES/BE (default: igsr)
# - --es-container NAME  ES container name (default: es01)
# - --be-container NAME  BE container name (default: igsr-be)
# - --fe-container NAME  FE container name (default: igsr-fe)
# - --es-image IMAGE     ES image (default: docker.elastic.co/elasticsearch/elasticsearch:8.17.2)
# - --be-image IMAGE     BE image (default: igsr-be)
# - --fe-image IMAGE     FE image (default: igsr-fe)
# - --es-port PORT       ES host port (default: 9200)
# - --be-port PORT       BE host port (default: 8000)
# - --fe-port PORT       FE host port (default: 8080)
# - --no-cache         Disable Docker build cache (default: on)
# - --use-cache        Enable Docker build cache (default: off)
# - --skip-index       Skip ES indexing (default: off)
# - --reset-colima     Delete/recreate Colima profiles (default: off)
# - --dry-run          Print what would happen without running commands (default: off)
# - --colima-dns LIST  Comma-separated DNS servers for Colima (e.g. 8.8.8.8,1.1.1.1)
#
# Example (reccomended: add --dry-run when running this script for the first time to check setup):
#   local_igsr_site_instance_up.sh \
#     --fe-repo "/path/to/gca_1000genomes_website" \
#     --be-repo "/path/to/igsr-be" \
#     --es-py-repo "/path/to/es/es-py" \
#     --es-config "/path/to/es/config.ini" \
#     --api-config "/path/to/igsr-be/.env"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

FE_REPO=""
BE_REPO=""
ES_REPO=""
ES_PY_REPO=""

STACK_CONTEXT="colima"
FE_CONTEXT="colima-amd64"

NETWORK="igsr"
ES_CONTAINER="es01"
BE_CONTAINER="igsr-be"
FE_CONTAINER="igsr-fe"

ES_IMAGE="docker.elastic.co/elasticsearch/elasticsearch:8.17.2"
BE_IMAGE="igsr-be"
FE_IMAGE="igsr-fe"

ES_PORT="9200"
BE_PORT="8000"
FE_PORT="8080"

FE_PLATFORM="linux/amd64"
FE_API_BASE="http://host.lima.internal:8000"

ENV_FILE=""
CONFIG_FILE=""

NO_CACHE=1                            # 1 = rebuild images without cache
SKIP_INDEX=0                          # 1 = skip ES indexing
RESET_COLIMA=0                        # 1 = delete/recreate colima profiles
DRY_RUN=0                             # 1 = print actions only
ESPY_VENV_DIR=""
FE_BRANCH=""
BE_BRANCH=""
ES_BRANCH=""
COLIMA_DNS="8.8.8.8,1.1.1.1"

FE_REPO_SET=0
BE_REPO_SET=0
ES_PY_REPO_SET=0
ENV_FILE_SET=0
CONFIG_FILE_SET=0
ESPY_VENV_DIR_SET=0

log() { printf "\n==> %s\n" "$*"; }
warn() { printf "\nWARN: %s\n" "$*" >&2; }
die() { printf "\nERROR: %s\n" "$*" >&2; exit 1; }

stop_colima_on_error() {
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: would stop colima profiles (default, amd64)"
    return 0
  fi
  log "Stopping colima profiles due to error"
  colima stop >/dev/null 2>&1 || true
  colima stop --profile amd64 >/dev/null 2>&1 || true
}

on_error() {
  warn "Script failed near line $1. See output above for details."
  stop_colima_on_error
}

trap 'on_error $LINENO' ERR

usage() {
  cat <<EOF
Usage: $(basename "$0") [options]

Options:
  --fe-repo PATH       Full path to gca_1000genomes_website (required)
  --be-repo PATH       Full path to igsr-be (required)
  --es-py-repo PATH    Full path to es-py (required)
  --es-config PATH     Full path to config.ini for es-py
  --api-config PATH    Full path to igsr-be .env
  --espy-venv-dir PATH Full path to Python venv for es-py (auto-detected if not set)
  --fe-branch NAME     Git branch to checkout for FE (optional)
  --be-branch NAME     Git branch to checkout for BE (optional)
  --es-branch NAME     Git branch to checkout for ES/es-py (optional)
  --fe-api-base URL    FE upstream API base
  --fe-platform STR    FE build platform (default: linux/amd64)
  --network NAME       Docker network for ES/BE (default: igsr)
  --es-container NAME  ES container name (default: es01)
  --be-container NAME  BE container name (default: igsr-be)
  --fe-container NAME  FE container name (default: igsr-fe)
  --es-image IMAGE     ES image (default: docker.elastic.co/elasticsearch/elasticsearch:8.17.2)
  --be-image IMAGE     BE image (default: igsr-be)
  --fe-image IMAGE     FE image (default: igsr-fe)
  --es-port PORT       ES host port (default: 9200)
  --be-port PORT       BE host port (default: 8000)
  --fe-port PORT       FE host port (default: 8080)
  --no-cache           Disable Docker build cache (default)
  --use-cache          Enable Docker build cache
  --skip-index         Skip ES indexing
  --reset-colima       Delete/recreate Colima profiles
  --dry-run            Print actions only (no changes)
  --colima-dns LIST    Comma-separated DNS servers for Colima
  -h, --help           Show this help
EOF
}

parse_args() {
  while [ "$#" -gt 0 ]; do
    case "$1" in
      --fe-repo)
        FE_REPO="$2"; FE_REPO_SET=1; shift 2 ;;
      --be-repo)
        BE_REPO="$2"; BE_REPO_SET=1; shift 2 ;;
      --es-py-repo|--espy-repo)
        ES_PY_REPO="$2"; ES_PY_REPO_SET=1; shift 2 ;;
      --es-config|--es-py-config|--config)
        CONFIG_FILE="$2"; CONFIG_FILE_SET=1; shift 2 ;;
      --api-config|--env-file|--env)
        ENV_FILE="$2"; ENV_FILE_SET=1; shift 2 ;;
      --espy-venv-dir|--venv-dir)
        ESPY_VENV_DIR="$2"; ESPY_VENV_DIR_SET=1; shift 2 ;;
      --fe-branch)
        FE_BRANCH="$2"; shift 2 ;;
      --be-branch)
        BE_BRANCH="$2"; shift 2 ;;
      --es-branch)
        ES_BRANCH="$2"; shift 2 ;;
      --fe-api-base)
        FE_API_BASE="$2"; shift 2 ;;
      --fe-platform)
        FE_PLATFORM="$2"; shift 2 ;;
      --network)
        NETWORK="$2"; shift 2 ;;
      --es-container)
        ES_CONTAINER="$2"; shift 2 ;;
      --be-container)
        BE_CONTAINER="$2"; shift 2 ;;
      --fe-container)
        FE_CONTAINER="$2"; shift 2 ;;
      --es-image)
        ES_IMAGE="$2"; shift 2 ;;
      --be-image)
        BE_IMAGE="$2"; shift 2 ;;
      --fe-image)
        FE_IMAGE="$2"; shift 2 ;;
      --es-port)
        ES_PORT="$2"; shift 2 ;;
      --be-port)
        BE_PORT="$2"; shift 2 ;;
      --fe-port)
        FE_PORT="$2"; shift 2 ;;
      --no-cache)
        NO_CACHE=1; shift 1 ;;
      --use-cache)
        NO_CACHE=0; shift 1 ;;
      --skip-index)
        SKIP_INDEX=1; shift 1 ;;
      --reset-colima)
        RESET_COLIMA=1; shift 1 ;;
      --dry-run)
        DRY_RUN=1; shift 1 ;;
      --colima-dns)
        COLIMA_DNS="$2"; shift 2 ;;
      -h|--help)
        usage; exit 0 ;;
      *)
        die "Unknown argument: $1 (use --help)" ;;
    esac
  done
}

normalize_paths() {
  ES_REPO="$(dirname "$ES_PY_REPO")"
  if [ "$ENV_FILE_SET" = "0" ] && [ -z "$ENV_FILE" ]; then
    ENV_FILE="$BE_REPO/.env"
  fi
  if [ "$CONFIG_FILE_SET" = "0" ] && [ -z "$CONFIG_FILE" ]; then
    CONFIG_FILE="$ES_REPO/config.ini"
  fi
  if [ "$ESPY_VENV_DIR_SET" = "0" ] && [ -z "$ESPY_VENV_DIR" ]; then
    detect_espy_venv_dir
  fi
}

detect_espy_venv_dir() {
  local candidates=(
    "$ES_PY_REPO/.venv"
    "$ES_PY_REPO/espy-env"
    "$SCRIPT_DIR/.espy-venv"
  )
  local c
  for c in "${candidates[@]}"; do
    if [ -f "$c/pyvenv.cfg" ]; then
      ESPY_VENV_DIR="$c"
      return 0
    fi
  done
  ESPY_VENV_DIR="$SCRIPT_DIR/.espy-venv"
}

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"
}

check_prereqs() {
  log "Checking prerequisites"
  need_cmd colima
  need_cmd docker
  if [ "$SKIP_INDEX" != "1" ]; then
    need_cmd python3
  fi

  if ! docker buildx version >/dev/null 2>&1; then
    die "docker buildx is required (install Docker buildx plugin)"
  fi
}

check_required_paths() {
  if [ "$FE_REPO_SET" = "0" ] || [ -z "$FE_REPO" ]; then
    die "Missing --fe-repo (required)"
  fi
  if [ "$BE_REPO_SET" = "0" ] || [ -z "$BE_REPO" ]; then
    die "Missing --be-repo (required)"
  fi
  if [ "$ES_PY_REPO_SET" = "0" ] || [ -z "$ES_PY_REPO" ]; then
    die "Missing --es-py-repo (required)"
  fi
}

validate_paths() {
  if [ -n "$ENV_FILE" ] && [ -n "$ESPY_VENV_DIR" ] && [ "$ENV_FILE" = "$ESPY_VENV_DIR" ]; then
    die "API .env and es-py venv paths are the same: $ENV_FILE"
  fi
  if [ -n "$ENV_FILE" ] && [ -d "$ENV_FILE" ]; then
    die "API config should be a file, but is a directory: $ENV_FILE"
  fi
  if [ -n "$ESPY_VENV_DIR" ] && [ -f "$ESPY_VENV_DIR" ]; then
    die "es-py venv path should be a directory, but is a file: $ESPY_VENV_DIR"
  fi
  if [ -n "$CONFIG_FILE" ] && [ -d "$CONFIG_FILE" ]; then
    die "es-py config should be a file, but is a directory: $CONFIG_FILE"
  fi
  if [ -n "$ENV_FILE" ] && [ "$(basename "$ENV_FILE")" = "pyvenv.cfg" ]; then
    die "API config path looks like a venv file: $ENV_FILE"
  fi
  if [ -n "$ESPY_VENV_DIR" ] && [ "$(basename "$ESPY_VENV_DIR")" = ".env" ]; then
    die "es-py venv path looks like an .env file: $ESPY_VENV_DIR"
  fi
}

print_summary() {
  log "Configuration summary"
  cat <<EOF
Repos:
  FE_REPO      = $FE_REPO
  BE_REPO      = $BE_REPO
  ES_REPO      = $ES_REPO
  ES_PY_REPO   = $ES_PY_REPO
  FE_BRANCH    = ${FE_BRANCH:-<current>}
  BE_BRANCH    = ${BE_BRANCH:-<current>}
  ES_BRANCH    = ${ES_BRANCH:-<current>}

Config:
  API .env     = $ENV_FILE
  ES config    = $CONFIG_FILE
  es-py venv   = $ESPY_VENV_DIR

Docker contexts:
  STACK_CONTEXT = $STACK_CONTEXT
  FE_CONTEXT    = $FE_CONTEXT

Docker names/images:
  NETWORK      = $NETWORK
  ES_CONTAINER = $ES_CONTAINER
  BE_CONTAINER = $BE_CONTAINER
  FE_CONTAINER = $FE_CONTAINER
  ES_IMAGE     = $ES_IMAGE
  BE_IMAGE     = $BE_IMAGE
  FE_IMAGE     = $FE_IMAGE

Ports:
  ES  = $ES_PORT
  API = $BE_PORT
  FE  = $FE_PORT

Flags:
  NO_CACHE    = $NO_CACHE
  SKIP_INDEX  = $SKIP_INDEX
  RESET_COLIMA= $RESET_COLIMA
  DRY_RUN     = $DRY_RUN
EOF
}

check_ports() {
  if ! command -v lsof >/dev/null 2>&1; then
    return 0
  fi
  local port
  for port in "$ES_PORT" "$BE_PORT" "$FE_PORT"; do
    if lsof -iTCP:"$port" -sTCP:LISTEN -n -P >/dev/null 2>&1; then
      warn "Port ${port} is already in use on the host. This may cause container start failures."
    fi
  done
}

ensure_es_image() {
  log "Ensuring ES image is available: $ES_IMAGE"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: docker --context $STACK_CONTEXT pull $ES_IMAGE (if missing)"
    return 0
  fi
  if ! docker --context "$STACK_CONTEXT" image inspect "$ES_IMAGE" >/dev/null 2>&1; then
    if ! docker --context "$STACK_CONTEXT" pull "$ES_IMAGE"; then
      warn "Failed to pull ES image. This is often a Colima DNS issue."
      warn "Try: rerun with --colima-dns 8.8.8.8,1.1.1.1 (or your VPN DNS servers)."
      stop_colima_on_error
      die "Could not pull ES image: $ES_IMAGE"
    fi
  fi
}

checkout_branch() {
  local repo="$1"
  local branch="$2"
  if [ -z "$branch" ]; then
    return 0
  fi
  log "Checking out ${branch} in ${repo}"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: git -C \"$repo\" fetch --all --prune && git checkout \"$branch\""
    return 0
  fi
  if ! command -v git >/dev/null 2>&1; then
    die "git not found but branch checkout requested for $repo"
  fi
  if [ ! -d "$repo/.git" ]; then
    die "Not a git repo: $repo"
  fi
  (cd "$repo" && git fetch --all --prune && git checkout "$branch")
}


colima_profile_exists() {
  colima list 2>/dev/null | awk 'NR>1 {print $1}' | grep -qx "$1"
}

ensure_repo() {
  [ -d "$1" ] || die "Missing repo directory: $1"
}

cache_arg() {
  if [ "$NO_CACHE" = "1" ]; then
    echo "--no-cache"
  fi
}

colima_dns_flags() {
  if [ -z "$COLIMA_DNS" ]; then
    echo ""
    return 0
  fi
  local flags=()
  local dns
  IFS=',' read -r -a dns <<<"$COLIMA_DNS"
  for d in "${dns[@]}"; do
    if [ -n "$d" ]; then
      flags+=("--dns" "$d")
    fi
  done
  printf "%s " "${flags[@]}"
}

start_colima_default() {
  log "Starting Colima default (ARM64) with host-reachable ports"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: colima start --network-address $(colima_dns_flags) (default profile)"
    return 0
  fi
  local dns_flags
  dns_flags="$(colima_dns_flags)"
  if colima_profile_exists default; then
    colima start --network-address ${dns_flags}
  else
    colima start --arch aarch64 --cpu 4 --memory 12 --disk 40 --network-address ${dns_flags}
  fi
}

start_colima_amd64() {
  log "Starting Colima amd64 profile"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: colima start --profile amd64 $(colima_dns_flags)"
    return 0
  fi
  local dns_flags
  dns_flags="$(colima_dns_flags)"
  if colima_profile_exists amd64; then
    colima start --profile amd64 ${dns_flags}
  else
    colima start --profile amd64 --arch x86_64 --cpu 4 --memory 8 --disk 60 ${dns_flags}
  fi
}

ensure_buildx() {
  log "Ensuring buildx builder (igsr-builder) in $FE_CONTEXT"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: docker --context $FE_CONTEXT buildx create/use igsr-builder"
    return 0
  fi
  if ! docker --context "$FE_CONTEXT" buildx inspect igsr-builder >/dev/null 2>&1; then
    docker --context "$FE_CONTEXT" buildx create --name igsr-builder --driver docker-container --use
  else
    docker --context "$FE_CONTEXT" buildx use igsr-builder >/dev/null 2>&1 || true
  fi
  docker --context "$FE_CONTEXT" buildx inspect --bootstrap >/dev/null
}

context_socket_path() {
  local profile="$1"
  local primary="$HOME/.colima/${profile}/docker.sock"
  local alt="$HOME/.colima/docker.sock"

  if [ -S "$primary" ]; then
    echo "$primary"
    return 0
  fi
  if [ "$profile" = "default" ] && [ -S "$alt" ]; then
    echo "$alt"
    return 0
  fi
  echo ""
}

ensure_docker_context() {
  local name="$1"
  local profile="$2"
  if docker context inspect "$name" >/dev/null 2>&1; then
    return 0
  fi
  local sock
  sock="$(context_socket_path "$profile")"
  if [ -z "$sock" ]; then
    die "Docker context '$name' missing and socket not found for profile '$profile'. Is colima running?"
  fi
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: docker context create $name --docker host=unix://$sock"
    return 0
  fi
  docker context create "$name" --docker "host=unix://$sock" >/dev/null
}

ensure_contexts() {
  log "Ensuring docker contexts exist"
  ensure_docker_context "$STACK_CONTEXT" "default"
  ensure_docker_context "$FE_CONTEXT" "amd64"
}

ensure_env_file() {
  if [ ! -f "$ENV_FILE" ]; then
    log "Creating .env at $ENV_FILE"
    if [ "$DRY_RUN" = "1" ]; then
      log "DRY RUN: would write .env defaults"
      return 0
    fi
    cat >"$ENV_FILE" <<'EOF'
PORT=8000
CORS_ALLOW_ORIGINS=["http://localhost:8080"]
ES_HOST=http://localhost:9200
ES_USERNAME=
ES_PASSWORD=
ES_API_KEY=
EOF
  else
    log "Using existing .env at $ENV_FILE"
  fi
}

ensure_config_file() {
  if [ ! -f "$CONFIG_FILE" ]; then
    log "Creating config.ini at $CONFIG_FILE"
    if [ "$DRY_RUN" = "1" ]; then
      log "DRY RUN: would write config.ini defaults"
      return 0
    fi
    local db_pass=""
    if [ -t 0 ]; then
      printf "Enter MySQL password for config.ini (input hidden): " >&2
      read -r -s db_pass
      echo >&2
    elif [ -r /dev/tty ]; then
      printf "Enter MySQL password for config.ini (input hidden): " >/dev/tty
      read -r -s db_pass </dev/tty
      echo >/dev/tty
    else
      die "Cannot prompt for MySQL password. Create $CONFIG_FILE manually or run in an interactive terminal."
    fi
    if [ -z "$db_pass" ]; then
      die "MySQL password is empty. Aborting."
    fi
    cat >"$CONFIG_FILE" <<EOF
[database]
host=mysql-igsr-web
port=4641
user=g1krw
password=${db_pass}
name=igsr_website_v2

[site]
site_root=http://localhost:8080
site_base=http://localhost:8080
EOF
  else
    log "Using existing config.ini at $CONFIG_FILE"
  fi
}

wait_for_es() {
  log "Waiting for Elasticsearch on http://localhost:${ES_PORT}"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: would wait for Elasticsearch readiness"
    return 0
  fi
  if command -v curl >/dev/null 2>&1; then
    for i in {1..60}; do
      if curl -s "http://localhost:${ES_PORT}" >/dev/null 2>&1; then
        return 0
      fi
      sleep 2
    done
    die "Elasticsearch did not become ready in time."
  else
    log "curl not found; sleeping 10s instead"
    sleep 10
  fi
}

clean_all() {
  log "Stopping/removing containers and networks in both contexts"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: docker rm -f $FE_CONTAINER $BE_CONTAINER $ES_CONTAINER (both contexts)"
    log "DRY RUN: docker network rm $NETWORK (both contexts)"
    return 0
  fi
  for ctx in "$STACK_CONTEXT" "$FE_CONTEXT"; do
    docker --context "$ctx" rm -f "$FE_CONTAINER" "$BE_CONTAINER" "$ES_CONTAINER" >/dev/null 2>&1 || true
    docker --context "$ctx" network rm "$NETWORK" >/dev/null 2>&1 || true
  done
}

start_es() {
  log "Starting Elasticsearch"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: docker --context $STACK_CONTEXT run -d --name $ES_CONTAINER ... $ES_IMAGE"
    return 0
  fi
  docker --context "$STACK_CONTEXT" network create "$NETWORK" >/dev/null 2>&1 || true
  docker --context "$STACK_CONTEXT" run -d --name "$ES_CONTAINER" --network "$NETWORK" \
    -p "${ES_PORT}:9200" -p 9300:9300 \
    -e discovery.type=single-node \
    -e xpack.security.enabled=false \
    -e xpack.security.enrollment.enabled=false \
    "$ES_IMAGE" >/dev/null
}

index_es() {
  if [ "$SKIP_INDEX" = "1" ]; then
    log "Skipping ES indexing (SKIP_INDEX=1)"
    return 0
  fi
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: would run es-py indexing locally"
    return 0
  fi
  index_es_local
}

index_es_local() {
  if [ "${1:-}" = "--check" ]; then
    command -v python3 >/dev/null 2>&1 || return 1
    return 0
  fi
  log "Indexing ES using es-py (local Python)"
  command -v python3 >/dev/null 2>&1 || die "python3 not found (install Python 3 to run local indexing)"

  if [ ! -f "$CONFIG_FILE" ]; then
    die "config.ini not found at $CONFIG_FILE (use --es-config to point to it)"
  fi

  local db_host
  db_host="$(awk -F= '
    $1 ~ /^[[:space:]]*host[[:space:]]*$/ {gsub(/^[[:space:]]+|[[:space:]]+$/, "", $2); print $2; exit}
  ' "$CONFIG_FILE" || true)"

  if [ -n "$db_host" ]; then
    log "DB host from config.ini: $db_host"
    if ! python3 - "$db_host" <<'PY' >/dev/null 2>&1
import socket, sys
socket.gethostbyname(sys.argv[1])
PY
    then
      warn "DB host '$db_host' does not resolve from this machine. Ensure VPN/DNS or update config.ini."
    fi
  else
    warn "Could not read DB host from $CONFIG_FILE"
  fi

  if [ ! -d "$ESPY_VENV_DIR" ]; then
    log "Creating venv at $ESPY_VENV_DIR"
    python3 -m venv "$ESPY_VENV_DIR"
    "$ESPY_VENV_DIR/bin/pip" install --upgrade pip
    "$ESPY_VENV_DIR/bin/pip" install -r "$ES_PY_REPO/requirements.txt"
  fi

  local es_host="http://127.0.0.1:${ES_PORT}/"
  local mods=(
    population_index
    analysis_group_index
    data_collection_index
    file_index
    sample_index
    super_population_index
  )

  local mod
  for mod in "${mods[@]}"; do
    log "Indexing ${mod}"
    (cd "$ES_PY_REPO" && "$ESPY_VENV_DIR/bin/python" -m "index.${mod}.indexing" \
      --config_file "$CONFIG_FILE" \
      --es_host "$es_host" \
      --type_of create)
  done
}

build_and_start_be() {
  log "Building igsr-be"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: docker --context $STACK_CONTEXT build $(cache_arg) -t $BE_IMAGE $BE_REPO"
    log "DRY RUN: docker --context $STACK_CONTEXT run -d --name $BE_CONTAINER ..."
    return 0
  fi
  docker --context "$STACK_CONTEXT" build $(cache_arg) -t "$BE_IMAGE" "$BE_REPO"

  log "Starting igsr-be"
  docker --context "$STACK_CONTEXT" run -d --name "$BE_CONTAINER" --network "$NETWORK" \
    -p "${BE_PORT}:8000" \
    -e PORT=8000 \
    -e ES_HOST="http://${ES_CONTAINER}:9200" \
    --env-file "$ENV_FILE" \
    "$BE_IMAGE" >/dev/null
}

build_and_start_fe() {
  log "Building igsr-fe (amd64)"
  if [ "$DRY_RUN" = "1" ]; then
    log "DRY RUN: docker --context $FE_CONTEXT build $(cache_arg) --platform $FE_PLATFORM -t $FE_IMAGE $FE_REPO"
    log "DRY RUN: docker --context $FE_CONTEXT run -d --name $FE_CONTAINER ..."
    return 0
  fi
  docker --context "$FE_CONTEXT" build $(cache_arg) --platform "$FE_PLATFORM" -t "$FE_IMAGE" "$FE_REPO"

  log "Starting igsr-fe"
  docker --context "$FE_CONTEXT" run -d --name "$FE_CONTAINER" \
    -p "${FE_PORT}:80" \
    -e API_BASE="$FE_API_BASE" \
    "$FE_IMAGE" >/dev/null
}

main() {
  parse_args "$@"
  check_required_paths
  normalize_paths

  check_prereqs
  validate_paths
  print_summary
  check_ports

  checkout_branch "$FE_REPO" "$FE_BRANCH"
  checkout_branch "$BE_REPO" "$BE_BRANCH"
  checkout_branch "$ES_REPO" "$ES_BRANCH"

  if [ "$RESET_COLIMA" = "1" ]; then
    log "RESET_COLIMA=1: deleting Colima profiles (destructive)"
    if [ "$DRY_RUN" = "1" ]; then
      log "DRY RUN: would stop/delete colima profiles"
    else
    colima stop >/dev/null 2>&1 || true
    colima stop --profile amd64 >/dev/null 2>&1 || true
    colima delete -f >/dev/null 2>&1 || true
    colima delete -f --profile amd64 >/dev/null 2>&1 || true
    fi
  fi

  ensure_repo "$FE_REPO"
  ensure_repo "$BE_REPO"
  ensure_repo "$ES_REPO"
  ensure_repo "$ES_PY_REPO"

  start_colima_default
  start_colima_amd64
  ensure_contexts
  ensure_buildx
  ensure_es_image

  clean_all
  ensure_env_file
  ensure_config_file

  start_es
  wait_for_es
  index_es
  build_and_start_be
  build_and_start_fe

  log "Done"
  echo "FE: http://localhost:${FE_PORT}/"
  echo "BE: http://localhost:${BE_PORT}/beta/health"
  echo "ES: http://localhost:${ES_PORT}/"
}

main "$@"
