<template>
    <button type="button" :class="bClass" v-html="bIcon" @click="actioned"></button>
</template>

<script>
    export default {
        name: "TableButton",
        props: {
            name: {type: String, required: true},
            rowData: {type: [Object, Array], required: true},
            bClass: {type: String, default: "btn btn-sm text-primary"},
            bIcon: {type: String, default: "<i class=\"bdticon bdticon-pencil\"/>"},
            bClick: {
                type: Function, default() {
                }
            }
        },
        methods: {
            actioned() {
                this.bClick(this.name.replace('/^{|}$/i',''),this.rowData);
            }
        }
    }
</script>

<style scoped>

</style>
