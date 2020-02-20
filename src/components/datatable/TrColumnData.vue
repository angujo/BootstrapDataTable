<template>
    <td v-if="isComponent">
        <template v-if="props.length>0">
            <div class="btn-group-sm btn-group">
                <div :is="template" v-for="(pr,i) in props" :key="tableRef+index+i" v-bind="pr"></div>
            </div>
        </template>
        <div :is="template" :table-ref="tableRef" :key="tableRef+index" v-bind="props" v-else-if="isCheckbox"></div>
        <div :is="template" v-bind="{rowData:content}" :key="tableRef+index" v-else></div>
    </td>
    <td v-else v-html="content"></td>
</template>

<script>
    import _ from 'lodash';
    import BootstrapDataTableMixin from "../../mixins/BootstrapDataTableMixin";

    export default {
        name: "TrColumnData",
        mixins: [BootstrapDataTableMixin],
        props: {
            name: {type: [String, Object]},
            template: {type: Object},
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
                return _.isObject(this.template);
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>

</style>
