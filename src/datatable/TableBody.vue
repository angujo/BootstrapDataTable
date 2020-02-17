<template>
    <tbody>
    <template v-if="data.length>0">
        <table-row :table-ref="tableRef" v-for="(dt) in cleanData" :data="dt.columns" :index="dt.index" :key="dt.index"/>
    </template>
    <tr v-else>
        <td :colspan="columnsLength" class="bg-light">
            <div class="p-5 text-center d-flex justify-content-center">
                <div>No Data</div>
            </div>
        </td>
    </tr>
    </tbody>
</template>

<script>
    import _ from 'lodash';
    import TableRow from "./TableRow";
    import BootstrapDataTableMixin from "./BootstrapDataTableMixin";
    import {tableFunctions} from "./bootstrapTableStore";
    import TableButton from "./TableButton";
    import DataCheckbox from "./DataCheckbox";

    export default {
        name: "TableBody",
        props: {
            columns: {
                type: Array, default() {
                    return [];
                }
            },
            data: {type: Array, required: true},
            startIndex: {type: Number, default: 0},
            pageVariable: [String, Number]
        },
        mixins: [BootstrapDataTableMixin],
        computed: {
            columnsLength() {
                return this.columns.length <= 0 ? 1 : this.columns.length;
            },
            cleanData() {
                if (this.columns.length <= 0) return this.data.map(d => {
                    return {column: null, data: d};
                });
                let ndata = [], rData, clm, nRow, nColumn, index = 0;
                for (let i = 0; i < this.data.length; i++) {
                    rData = this.data[i];
                    nRow = [];
                    index = this.startIndex + i + 1;
                    for (let c = 0; c < this.columns.length; c++) {
                        clm = this.columns[c];
                        nColumn = {content: null, column: Object.assign({}, this.columns[c]), name: clm.name, index: index};
                        delete nColumn.column.name;
                        if (_.isString(clm.name)) {
                            var names = _.uniq(clm.name.match(/{\w+}/gi));
                            if (names.length > 0) {
                                switch (clm.name) {
                                    case tableFunctions.columnCheckbox:
                                        nColumn.name = DataCheckbox;
                                        nColumn.isCheckbox = true;
                                        nColumn.props = {};
                                        nColumn.props.rowData = rData;
                                        nColumn.props.index = index;
                                        if (_.has(clm, 'variable') && _.isString(clm.variable) && _.has(rData, clm.variable) &&
                                            (_.isString(rData[clm.variable]) || _.isNumber(rData[clm.variable]))) {
                                            nColumn.props.variable = _.get(rData, clm.variable, null);
                                        } else {
                                            nColumn.props.variable = index;
                                        }
                                        if (_.has(clm, 'action') && _.isFunction(clm.action)) {
                                            nColumn.props.action = clm.action;
                                        }
                                        break;
                                    case tableFunctions.columnID:
                                        nColumn.content = index;
                                        break;
                                    default:
                                        nColumn.props = [];
                                        var cc = 0, styles = _.has(clm, 'styles') && _.isArray(clm.styles) ? styles = clm.styles : (_.isPlainObject(clm.styles) ? [clm.styles] : []),
                                            def_style = {class: "btn btn-secondary", html: "<i class='bdticon bdticon-option'/>"};
                                        for (let i = 0; i < names.length; i++) {
                                            switch (names[i]) {
                                                case tableFunctions.columnView:
                                                    nColumn.props.push({rowData: rData, bClick: clm.action, bClass: "btn text-info", bIcon: "<i class='bdticon bdticon-eye-fill'/>", name: 'view'});
                                                    break;
                                                case tableFunctions.columnEdit:
                                                    nColumn.props.push({rowData: rData, bClick: clm.action, bClass: "btn text-primary", bIcon: "<i class='bdticon bdticon-pencil'/>", name: 'edit'});
                                                    break;
                                                case tableFunctions.columnDelete:
                                                    nColumn.props.push({rowData: rData, bClick: clm.action, bClass: "btn text-danger", bIcon: "<i class='bdticon bdticon-trash'/>", name: 'delete'});
                                                    break;
                                                case tableFunctions.columnButton:
                                                    cc++;
                                                    var style = Object.assign({}, _.get(styles, cc-1, def_style));
                                                    nColumn.props.push({rowData: rData, bClick: clm.action, bClass: style.class, bIcon: style.html, name: 'custom_button' + cc});
                                                    break;
                                            }
                                        }
                                        if (nColumn.props.length > 0) nColumn.name = TableButton;
                                }
                            } else if (_.has(clm, 'formatter') && _.isFunction(clm.formatter)) {
                                nColumn.content = clm.formatter(_.get(rData, clm.name, null));
                            } else {
                                nColumn.content = _.get(rData, clm.name, null);
                            }
                        } else {
                            nColumn.content = rData;
                        }
                        nRow.push(nColumn);
                    }
                    ndata.push({index: index, columns: nRow});
                }
                return ndata;
            }
        },
        components: {TableRow},
        watch: {
            data: {
                handler() {
                    if (null !== this.pageVariable) {
                        tableFunctions.checkBoxValues[this.tableRef] = this.data.map((d, i) => {
                            if (-1 === this.pageVariable) return this.startIndex + i + 1;
                            let v = _.get(d, tableFunctions.checkBoxVariables, null);
                            return null === v ? this.startIndex + i + 1 : v;
                        });
                    }
                }
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>
