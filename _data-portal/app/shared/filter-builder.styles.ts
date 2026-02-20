export const filterBuilderStyles: string = `

div.table-container {
  padding-right: 90px;
  position: relative;
  overflow-y: auto;
}

h3.current-filters {
  display: inline-block;
}

.filter-selected {
  outline: 3px solid #1f2937;
  box-shadow: 0 0 0 2px rgba(31, 41, 55, 0.25);
}

.group-controls {
  margin-left: 0;
}

.tools-row {
  margin-bottom: 8px;
}

.filter-builder-panel {
  margin-top: 12px;
  border-color: #d9d9d9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

.filter-builder-panel .panel-body {
  background-color: #fafafa;
}

h3.current-filters.section-indicator {
  background-color: #f4f4f4;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  color: #505050;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1;
  margin: 0 10px 0 0;
  min-width: 92px;
  padding: 6px 10px;
  text-align: center;
  text-transform: uppercase;
  vertical-align: middle;
}

.filter-builder-help {
  color: #555;
  font-size: 14px;
  line-height: 1.4;
  margin: 0 0 18px;
}

.filter-builder-steps {
  margin: 6px 0 0 24px;
  padding-left: 18px;
}

.filter-builder-steps li {
  margin-bottom: 10px;
}

.filter-builder-steps li:last-child {
  margin-bottom: 0;
}

.filter-builder-steps li strong {
  color: #444;
  display: block;
  font-weight: 700;
  margin-bottom: 2px;
}

.filter-builder-steps li code {
  background-color: #ececec;
  border-radius: 3px;
  padding: 0 3px;
}

.group-control-btn {
  min-width: 70px;
  text-align: center;
}

.group-paren {
  font-weight: 800;
  font-size: 20px;
  margin: 0 6px;
  color: #222;
}

p.readable-filter-summary {
  display: inline-block;
  margin: 0;
  color: #6b7280;
  font-size: 15px;
  font-style: italic;
  vertical-align: middle;
}

p.readable-filter-summary strong {
  font-style: normal;
  font-weight: 700;
}

.filter-builder-help p {
  margin: 0;
}

.query-description-block {
  margin-top: 10px;
  margin-bottom: 12px;
}

@media (max-width: 991px) {
  div.table-container {
    width: 100%;
    overflow-x: scroll;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    -webkit-overflow-scrolling: touch;
    padding-right: 0px;
  }
}
div.table-buttons {
  position: absolute;
  top: 0;
}
div.table-buttons h4 {
  margin: 10px 0px;
}

button.page-button {
  border: 1px solid #ddd;
  border-radius: 15px;
  margin: 0px 0px 10px;
}

button.operator-chip {
  border-radius: 12px;
  font-weight: bold;
  margin: 0 6px;
  padding: 3px 10px;
}

.filter-negated {
  overflow: hidden;
  padding-left: 50px;
  position: relative;
}

.chip-negation-flag {
  align-items: center;
  background-color: #c9302c;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  bottom: 0;
  color: #fff;
  display: flex;
  font-size: 10px;
  font-weight: bold;
  justify-content: center;
  letter-spacing: 0.25px;
  left: 0;
  line-height: 1;
  position: absolute;
  top: 0;
  width: 42px;
}
`;
