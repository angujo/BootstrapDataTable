<template>
    <tr>
        <tr-column-data :table-ref="tableRef" v-for="(rd,i) in data" :key="i" v-bind="rd"/>
    </tr>
</template>

<script>
    import TrColumnData from "./TrColumnData";
    import BootstrapDataTableMixin from "./BootstrapDataTableMixin";

    export default {
        name: "TableRow",
        mixins: [BootstrapDataTableMixin],
        components: {TrColumnData},
        props: {
            data: {type: Array, required: true}
        }
    }
</script>

<style scoped>

</style>
