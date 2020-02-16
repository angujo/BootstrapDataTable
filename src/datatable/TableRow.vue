<template>
    <tr :class="rowColor">
        <tr-column-data :table-ref="tableRef" v-for="(rd,i) in data" :key="i" v-bind="rd"/>
    </tr>
</template>

<script>
    import TrColumnData from "./TrColumnData";
    import BootstrapDataTableMixin from "./BootstrapDataTableMixin";
    import BootTableEvent from "./BootTableEvent";

    export default {
        name: "TableRow",
        mixins: [BootstrapDataTableMixin],
        components: {TrColumnData},
        props: {
            index: {type: Number, default: 0},
            data: {type: Array, required: true}
        },
        data() {
            return {rowColor: null}
        },
        mounted() {
            BootTableEvent.$on(this.tableRef + '-row-' + this.index, (s) => {
                console.log('Row event-'+this.index);
                this.rowColor = s ? 'table-info' : null;
            });
        }
    }
</script>

<style scoped>

</style>
