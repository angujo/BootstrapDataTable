<template>
    <div>
        <strong>{{rowData.first_name}}</strong>
        <div class="text-muted small font-italic">{{rowData.email}}</div>
    </div>
</template>

<script>
    import ColumnDataMixin from "../../mixins/ColumnDataMixin";

    export default {
        name: "TestColumn",
        mixins: [ColumnDataMixin]
    }
</script>

<style scoped>

</style>
