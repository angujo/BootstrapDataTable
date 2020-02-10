<template>
    <td v-if="isComponent">
        <template v-if="props.length>0">
            <div class="btn-group-sm btn-group">
                <div :is="name" v-for="(pr,i) in props" :key="tableRef+index+i" v-bind="pr"></div>
            </div>
        </template>
        <div :is="name" :table-ref="tableRef" :key="tableRef+index" v-bind="props" v-else-if="isCheckbox"></div>
        <div :is="name" v-bind="{rowData:content}" :key="tableRef+index" v-else></div>
    </td>
    <td v-else v-html="content"></td>
</template>

<script>
    import BootstrapDataTableMixin from "./BootstrapDataTableMixin";

    export default {
        name: "TrColumnData",
        mixins: [BootstrapDataTableMixin],
        props: {
            name: {type: [String, Object], required: true},
            column: Object,
            content: null,
            index: {type: Number, default: 0},
            isCheckbox: Boolean,
            props: {
                type: [Array, Object], default() {
                    return [];
                }
            }
        },
        computed: {
            isComponent() {
                return _.isObject(this.name);
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>
