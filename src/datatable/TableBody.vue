<template>
    <tbody>
    <template v-if="data.length>0">
        <table-row :table-ref="tableRef" v-for="(dt,i) in cleanData" :data="dt" :key="i"/>
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
                            if (Object.keys(tableFunctions.specialColumns()).includes(clm.name)) {
                                switch (clm.name) {
                                    case tableFunctions.columnCheckbox:
                                        nColumn.name = DataCheckbox;
                                        nColumn.isCheckbox = true;
                                        nColumn.props = {};
                                        nColumn.props.rowData = rData;
                                        nColumn.props.index = index;
                                        if (_.has(clm, 'variable') && _.isString(clm.variable) &&
                                            (_.get(rData, clm.variable, null).isString() || _.get(rData, clm.variable, null).isNumber())) {
                                            nColumn.props.variable = _.get(rData, clm.variable, null);
                                        } else {
                                            nColumn.props.variable = index;
                                        }
                                        break;
                                    case tableFunctions.columnID:
                                        nColumn.content = index;
                                        break;
                                    case tableFunctions.columnEDel:
                                        nColumn.name = TableButton;
                                        nColumn.props = [{rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-primary", bIcon: "<i class='fa fa-edit'/>", name: 'edit'},
                                            {rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-danger", bIcon: "<i class='fa fa-trash'/>", name: 'delete'}];
                                        break;
                                    case tableFunctions.columnViEdit:
                                        nColumn.name = TableButton;
                                        nColumn.props = [{rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-primary", bIcon: "<i class='fa fa-edit'/>", name: 'edit'},
                                            {rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-info", bIcon: "<i class='fa fa-eye'/>", name: 'view'}];
                                        break;
                                    case tableFunctions.columnEdit:
                                        nColumn.name = TableButton;
                                        nColumn.props = [{rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-primary", bIcon: "<i class='fa fa-edit'/>", name: 'edit'}];
                                        break;
                                    case tableFunctions.columnDelete:
                                        nColumn.name = TableButton;
                                        nColumn.props = [{rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-danger", bIcon: "<i class='fa fa-trash'/>", name: 'edit'}];
                                        break;
                                    case tableFunctions.columnView:
                                        nColumn.name = TableButton;
                                        nColumn.props = [{rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-info", bIcon: "<i class='fa fa-eye'/>", name: 'view'}];
                                        break;
                                    case tableFunctions.columnViEDel:
                                        nColumn.name = TableButton;
                                        nColumn.props = [{rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-info", bIcon: "<i class='fa fa-eye'/>", name: 'view'},
                                            {rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-primary", bIcon: "<i class='fa fa-edit'/>", name: 'edit'},
                                            {rowData: rData, bClick: clm.action, bClass: "btn btn-sm text-danger", bIcon: "<i class='fa fa-trash'/>", name: 'delete'}
                                        ];
                                        break;
                                }
                            } else {
                                nColumn.content = _.get(rData, clm.name, null);
                            }
                        } else {
                            nColumn.content = rData;
                        }
                        nRow.push(nColumn);
                    }
                    ndata.push(nRow);
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
