<template>
    <th v-if="isCheckbox">
        <HeadCheckbox :table-ref="tableRef"/>
    </th>
    <th :class="tClass" v-html="title" v-else/>
</template>

<script>
    import {tableFunctions} from "./bootstrapTableStore";
    import HeadCheckbox from "./HeadCheckbox";
    import BootstrapDataTableMixin from "./BootstrapDataTableMixin";
    import _ from 'lodash';

    export default {
        name: "ThColumnData",
        components: {HeadCheckbox},
        mixins: [BootstrapDataTableMixin],
        props: {column: {type: Object, required: true}},
        data() {
            return {checker: false}
        },
        computed: {
            title() {
                return _.get(this.column, 'title',
                    _.split(_.has(this.column, 'name') && _.isObject(this.column.name) ? '' : _.get(this.column, 'name'), '_')
                        .map(n => {
                            if (Object.keys(tableFunctions.specialColumns()).includes(n)) {
                                return tableFunctions.specialColumnName(n);
                            }
                            return _.upperFirst(n);
                        }).join(" "));
            },
            tClass() {
                return _.get(this.column, 'titleClass', null);
            },
            isCheckbox() {
                return _.isString(this.column.name) && this.column.name.toString().toLowerCase().trim() === tableFunctions.columnCheckbox
            }
        }
    }
</script>

<style scoped>

</style>
