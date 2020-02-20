<template>
    <div class="text-center" @click="checkedBox">
        <i :class="['bdticon',myVal? 'bdticon-check-circle text-success':'bdticon-circle text-muted']"/>
    </div>
</template>

<script>
    import _ from 'lodash';
    import BootstrapDataTableMixin from "../../mixins/BootstrapDataTableMixin";
    import {tableFunctions} from "../../utils/bootstrapTableStore";
    import BootTableEvent from '../../utils/BootTableEvent';
    import ColumnDataMixin from "../../mixins/ColumnDataMixin";

    export default {
        name: "DataCheckbox",
        props: {
            index: {type: Number, required: true},
            variable: {type: [String, Number], required: true},
            action: {
                type: Function, default() {
                }
            },
            content: null
        },
        mixins: [BootstrapDataTableMixin, ColumnDataMixin],
        data() {
            return {myVal: false}
        },
        methods: {
            checkedBox() {
                this.myVal = !this.myVal;
                this.action(this.myVal, this.rowData);
            },
            setValue(p) {
                let index = tableFunctions.rowSelections[this.tableRef].indexOf(this.variable);
                if (p === null || p === undefined) p = index > -1;
                if (null === p || false === p) {
                    tableFunctions.rowSelections[this.tableRef].splice(index, 1);
                } else if (null === p || true === p) {
                    if (index === -1) tableFunctions.rowSelections[this.tableRef].push(this.variable);
                }
                this.myVal = tableFunctions.rowSelections[this.tableRef].indexOf(this.variable) > -1;
                BootTableEvent.$emit(this.tableRef + '-row-' + this.index, this.myVal);
                BootTableEvent.$emit(this.tableRef + 'head-check');
                //  console.log(tableFunctions.rowSelections[this.tableRef]);
            }
        },
        computed: {
            rows() {
                return tableFunctions.rowSelections[this.tableRef];
            },
            id() {
                return _.uniqueId(this.tableRef + 'dcheck' + this.index + tableFunctions.md5(Math.round((new Date()).getTime() / 1000)));
            },
            selections: {
                get() {
                    return tableFunctions.rowSelections[this.tableRef];
                }, set() {
                    //console.log(v);
                    this.setValue();
                }
            }
        },
        mounted() {
            BootTableEvent.$on(this.tableRef + 'data-check', () => {
                this.setValue(tableFunctions.selectAll[this.tableRef]);
            });
            if (_.has(tableFunctions.rowSelections, this.tableRef) && false === tableFunctions.selectAll[this.tableRef]) this.myVal = tableFunctions.rowSelections[this.tableRef].indexOf(this.variable) > -1;
            else if (true === tableFunctions.selectAll[this.tableRef]) this.myVal = true;
        },
        watch: {
            myVal(v) {
                if (false === v && true === tableFunctions.selectAll[this.tableRef]) tableFunctions.selectAll[this.tableRef] = false;
                this.setValue(v);
            }
        }
    }
</script>

<style scoped>
</style>
