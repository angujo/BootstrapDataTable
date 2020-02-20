<template>
    <tr>
        <th-column-data :table-ref="tableRef" v-for="(column,i) in columns" :key="i" :column="column"/>
    </tr>
</template>

<script>
    import ThColumnData from "./ThColumnData";
    import BootstrapDataTableMixin from "../../mixins/BootstrapDataTableMixin";

    export default {
        name: "TableHeader",
        mixins:[BootstrapDataTableMixin],
        components: {ThColumnData},
        props: {columns: {type: Array, required: true}}
    }
</script>

<style scoped>

</style>
