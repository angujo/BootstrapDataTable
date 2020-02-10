<template>
    <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" :id="id" v-model="selValue" @change="changedStatus">
        <label class="custom-control-label" :for="id"></label>
    </div>
</template>

<script>
    import BootstrapDataTableMixin from "./BootstrapDataTableMixin";
    import {tableFunctions} from "./bootstrapTableStore";

    export default {
        name: "HeadCheckbox",
        mixins: [BootstrapDataTableMixin],
        props: {},
        data() {
            return {selections: [], selected: false}
        }, methods: {
            changedStatus() {
            }
        },
        computed: {
            id() {
                return _.uniqueId(this.tableRef + 'hceck');
            },
            selValue: {
                get() {
                    return _.difference(tableFunctions.checkBoxValues[this.tableRef], tableFunctions.rowSelections[this.tableRef]) > 0;
                }, set(v) {
                    if (v) {
                        tableFunctions.rowSelections[this.tableRef] = Array.from((new Set(_.concat(tableFunctions.rowSelections[this.tableRef], tableFunctions.checkBoxValues[this.tableRef]))));
                    } else {
                        tableFunctions.rowSelections[this.tableRef] = tableFunctions.rowSelections[this.tableRef].filter(v => {
                            return !tableFunctions.checkBoxValues[this.tableRef].includes(v);
                        })
                    }
                    console.log(tableFunctions.rowSelections);
                }
            }
        }
    }
</script>

<style scoped>

</style>
