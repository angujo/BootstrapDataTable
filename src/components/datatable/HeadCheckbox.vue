<template>
    <span @click="changedStatus" class="">
        <i :class="['bdticon',selectALl? 'bdticon-check-circle text-success':(partial?'bdticon-circle-half text-info':'text-muted bdticon-circle')]"/>
    </span>
</template>

<script>
    import _ from 'lodash';
    import BootstrapDataTableMixin from "../../mixins/BootstrapDataTableMixin";
    import {tableFunctions} from "../../utils/bootstrapTableStore";
    import BootTableEvent from '../../utils/BootTableEvent';

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
                    //console.log(tableFunctions.rowSelections);
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
</style>
