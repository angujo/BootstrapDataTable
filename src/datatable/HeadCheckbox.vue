<template>
    <span @click="changedStatus">
        <i :class="['fa fa-2x',selectALl? 'fa-check-square text-success':(partial?'fa-minus-square text-info':'text-muted fa-square-o')]"/>
    </span>
</template>

<script>
    import _ from 'lodash';
    import BootstrapDataTableMixin from "./BootstrapDataTableMixin";
    import {tableFunctions} from "./bootstrapTableStore";
    import BootTableEvent from './BootTableEvent';

    export default {
        name: "HeadCheckbox",
        mixins: [BootstrapDataTableMixin],
        props: {},
        data() {
            return {partial: false, selectALl: false}
        }, methods: {
            changedStatus() {
                this.selectALl = tableFunctions.selectAll[this.tableRef] = !tableFunctions.selectAll[this.tableRef];
                BootTableEvent.$emit(this.tableRef + 'data-check');
                BootTableEvent.$emit(this.tableRef + 'select-event', this.selectALl);
            }
        },
        computed: {
            id() {
                return _.uniqueId(this.tableRef + 'hceck');
            },
            selValue: {
                get() {
                    return _.difference(tableFunctions.checkBoxValues[this.tableRef], tableFunctions.rowSelections[this.tableRef]) > 0;
                },
                set(v) {
                    tableFunctions.selectAll[this.tableRef] = v;
                    if (v) {
                        tableFunctions.rowSelections[this.tableRef] = Array.from((new Set(_.concat(tableFunctions.rowSelections[this.tableRef], tableFunctions.checkBoxValues[this.tableRef]))));
                    } else {
                        tableFunctions.rowSelections[this.tableRef] = tableFunctions.rowSelections[this.tableRef].filter(v => {
                            return !tableFunctions.checkBoxValues[this.tableRef].includes(v);
                        })
                    }
                    BootTableEvent.$emit(this.tableRef + 'data-check', v);
                    console.log(tableFunctions.rowSelections);
                }
            }
        }, mounted() {
            BootTableEvent.$on(this.tableRef + 'head-check', () => {
                this.selectALl = tableFunctions.selectAll[this.tableRef];
                this.partial = false === tableFunctions.selectAll[this.tableRef] && tableFunctions.rowSelections[this.tableRef].length > 0;
            });
        }
    }
</script>

<style scoped>
    .fa {
        font-size: 1.5rem;
    }
</style>
