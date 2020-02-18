<template>
    <tbody>
    <template v-if="data.length>0">
        <table-row :table-ref="tableRef" v-for="(dt) in cleanData" :columns="columns" v-bind="dt" :key="dt.index"/>
    </template>
    <tr key="ndt" v-else>
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
                return this.data.map((d, i) => {
                    return {index: this.startIndex + i + 1, data: d};
                });
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
