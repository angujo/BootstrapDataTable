<template>
    <fragment>
        <tr :class="rowColor" :key="'actrow-'+index">
            <tr-column-data :table-ref="tableRef" v-for="(rd,i) in cleanColumns" :key="i" v-bind="rd"/>
        </tr>
        <template v-if="null!==detailRow">
            <tr :key="'dtlrow-'+index" v-show="showDetail">
                <td :class="['detail-row-holder',showDetail?'enabled-down':'']" :colspan="cleanColumns.length" class="pt-0">
                    <div :is="detailRow" :row-data="data"/>
                </td>
            </tr>
        </template>
    </fragment>
</template>

<script>
    import _ from "lodash";
    import {Fragment} from 'vue-fragment';
    import TrColumnData from "./TrColumnData";
    import BootstrapDataTableMixin from "../../mixins/BootstrapDataTableMixin";
    import BootTableEvent from "../../utils/BootTableEvent";
    import {tableFunctions} from "../../utils/bootstrapTableStore";
    import DataCheckbox from "./DataCheckbox";
    import TableButton from "./TableButton";

    export default {
        name: "TableRow",
        mixins: [BootstrapDataTableMixin],
        components: {TrColumnData, Fragment},
        props: {
            columns: {
                type: Array, default() {
                    return [];
                }
            },
            index: {type: Number, default: 0},
            data: {type: [Object, Array], required: true}
        },
        data() {
            return {rowColor: null, showDetail: false, detailRow: null}
        }, methods: {
            stringColumn(clm, nColumn) {
                var names = _.uniq(clm.name.match(/{\w+}/gi));
                if (names.length > 0) {
                    switch (clm.name) {
                        case tableFunctions.columnCheckbox:
                            nColumn.template = DataCheckbox;
                            nColumn.isCheckbox = true;
                            nColumn.props = {};
                            nColumn.props.rowData = this.data;
                            nColumn.props.index = this.index;
                            if (_.has(clm, 'variable') && _.isString(clm.variable) && _.has(this.data, clm.variable) &&
                                (_.isString(this.data[clm.variable]) || _.isNumber(this.data[clm.variable]))) {
                                nColumn.props.variable = _.get(this.data, clm.variable, null);
                            } else {
                                nColumn.props.variable = this.index;
                            }
                            if (_.has(clm, 'action') && _.isFunction(clm.action)) {
                                nColumn.props.action = clm.action;
                            }
                            break;
                        case tableFunctions.columnID:
                            nColumn.content = this.index;
                            break;
                        default:
                            nColumn.props = [];
                            var cc = 0, styles = _.has(clm, 'styles') && _.isArray(clm.styles) ? styles = clm.styles : (_.isPlainObject(clm.styles) ? [clm.styles] : []),
                                def_style = {class: "btn btn-secondary", html: "<i class='bdticon bdticon-option'/>"};
                            for (let i = 0; i < names.length; i++) {
                                switch (names[i]) {
                                    case tableFunctions.columnView:
                                        nColumn.props.push({rowData: this.data, bClick: clm.action, bClass: "btn text-info", bIcon: "<i class='bdticon bdticon-eye-fill'/>", name: 'view'});
                                        break;
                                    case tableFunctions.columnDetailRow:
                                        if (!_.has(clm, 'detailRow') || !_.isObject(clm.detailRow)) continue;
                                        this.detailRow = clm.detailRow;
                                        nColumn.props.push({
                                            rowData: this.data, bClick: () => {
                                                this.showDetail = !this.showDetail;
                                            }, bClass: "btn text-info", bIcon: this.showDetail?"<i class='bdticon bdticon-chevron-right'/>":"<i class='bdticon bdticon-chevron-down'/>", name: 'view'
                                        });
                                        break;
                                    case tableFunctions.columnEdit:
                                        nColumn.props.push({rowData: this.data, bClick: clm.action, bClass: "btn text-primary", bIcon: "<i class='bdticon bdticon-pencil'/>", name: 'edit'});
                                        break;
                                    case tableFunctions.columnDelete:
                                        nColumn.props.push({rowData: this.data, bClick: clm.action, bClass: "btn text-danger", bIcon: "<i class='bdticon bdticon-trash'/>", name: 'delete'});
                                        break;
                                    case tableFunctions.columnButton:
                                        cc++;
                                        var style = Object.assign({}, _.get(styles, cc - 1, def_style));
                                        nColumn.props.push({rowData: this.data, bClick: clm.action, bClass: style.class, bIcon: style.html, name: 'custom_button' + cc});
                                        break;
                                }
                            }
                            if (nColumn.props.length > 0 && null === nColumn.template) nColumn.template = TableButton;
                    }
                } else if (_.has(clm, 'formatter') && _.isFunction(clm.formatter)) {
                    nColumn.content = clm.formatter(_.get(this.data, clm.name, null));
                } else {
                    nColumn.content = _.get(this.data, clm.name, null);
                }
                return nColumn;
            }
        },
        computed: {
            cleanColumns() {
                let nRow = [], clm, nColumn;
                for (let c = 0; c < this.columns.length; c++) {
                    clm = this.columns[c];
                    nColumn = {content: null, column: Object.assign({}, this.columns[c]), name: null, index: this.index, template: null};
                    delete nColumn.column.name;
                    if (_.isString(clm.name)) {
                        this.stringColumn(clm, nColumn);
                    } else {
                        nColumn.template = clm.name;
                        nColumn.name = null;
                        nColumn.content = this.data;
                    }
                    nRow.push(nColumn);
                }
                return nRow;
            }
        },
        mounted() {
            BootTableEvent.$on(this.tableRef + '-row-' + this.index, (s) => {
                this.rowColor = s ? 'table-info' : null;
            });
        }
    }
</script>

<style scoped>
    .detail-row-holder {
        opacity: 0;
        height: 0;
        transition: opacity 0.3s, height 0.3s 0.1s;
    }

    .enabled-down.detail-row-holder {
        opacity: 1;
        height: 30px;
        transition: opacity 0.3s 0.1s, height 0.3s;
    }
</style>
