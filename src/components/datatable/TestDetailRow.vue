<template>
    <div class="bg-light">
        <h4 class="text-center">This is a dummy detail row</h4>
        <div class="small text-muted">
            {{rowData}}
        </div>
    </div>
</template>

<script>
    import ColumnDataMixin from "../../mixins/ColumnDataMixin";

    export default {
        name: "TestDetailRow",
        mixins:[ColumnDataMixin]
    }
</script>

<style scoped>

</style>
