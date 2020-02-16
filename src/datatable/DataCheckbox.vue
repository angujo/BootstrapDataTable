<template>
    <div>
        <span @click="myVal=!myVal">
            <i :class="['fa text-success',myVal? 'fa-check-square':'fa-square-o']"/>
        </span>
    </div>
</template>

<script>
    import _ from 'lodash';
    import BootstrapDataTableMixin from "./BootstrapDataTableMixin";
    import {tableFunctions} from "./bootstrapTableStore";
    import BootTableEvent from './BootTableEvent';

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
        mixins: [BootstrapDataTableMixin],
        data() {
            return {myVal: false}
        },
        methods: {
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
                }, set(v) {
                    console.log(v);
                    this.setValue();
                }
            }
        },
        mounted() {
            BootTableEvent.$on(this.tableRef + 'data-check', (e) => {
                this.setValue(e);
            });
            if (_.has(tableFunctions.rowSelections, this.tableRef)) this.myVal = tableFunctions.rowSelections[this.tableRef].indexOf(this.variable) > -1;
        },
        watch: {
            rows: {
                handler(v) {
                    console.log(v);
                }, deep: true
            },
            myVal(v) {
                // console.log(v);
                this.setValue(v);
            }
        }
    }
</script>

<style scoped>
    .fa {
        font-size: 1.5rem;
    }
</style>
