<template>
    <div class="custom-control custom-checkbox">
        <input type="checkbox" class="custom-control-input" :id="id" :value="variable" v-model="selections">
        <label class="custom-control-label" :for="id"></label>
    </div>
</template>

<script>
    import BootstrapDataTableMixin from "./BootstrapDataTableMixin";
    import {tableFunctions} from "./bootstrapTableStore";

    export default {
        name: "DataCheckbox",
        props: {
            index: {type: Number, required: true},
            variable: {type: [String, Number], required: true},
            action: {
                type: Function, default(s, d) {
                }
            },
            content: null
        },
        mixins: [BootstrapDataTableMixin],
        data() {
            return {}
        },
        methods: {},
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
                }, set(v) {
                    let index = tableFunctions.rowSelections[this.tableRef].indexOf(this.variable);
                    if (index > -1) {
                        tableFunctions.rowSelections[this.tableRef].splice(index, 1);
                    } else {
                        tableFunctions.rowSelections[this.tableRef].push(this.variable);
                    }
                    console.log(tableFunctions.rowSelections[this.tableRef]);
                }
            }
        },
        mounted() {
        },
        watch: {
            rows: {
                handler(v) {
                    console.log(v);
                }, deep: true
            }
        }
    }
</script>

<style scoped>

</style>
