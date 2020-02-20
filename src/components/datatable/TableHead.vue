<template>
    <thead>
    <table-header :table-ref="tableRef" :columns="columns"/>
    <column-search :columns="searchColumns" v-if="searchColumns.length>0" @searched="searched"/>
    </thead>
</template>

<script>
  import _ from 'lodash';
    import TableHeader from "./TableHeader";
    import ColumnSearch from "./ColumnSearch";
    import BootstrapDataTableMixin from "../../mixins/BootstrapDataTableMixin";

    export default {
        name: "TableHead",
        props: {
            columns: {type: Array, required: true},
        },
        mixins: [BootstrapDataTableMixin],
        components: {TableHeader, ColumnSearch},
        methods: {
            searched(q) {
                this.$emit('searched', q);
            }
        },
        computed: {
            searchColumns() {
                let c = this.columns.map(c => {
                    let r = {var: null, options: []};
                    if (_.has(c, 'search')) {
                        r.var = c.name;
                        if (_.isString(c.search)) {
                            r.var = c.search;
                        } else if (_.isArray(c.search)) {
                            r.options = c.search;
                        }
                    }
                    if (!_.isString(r.var)) r.var = null;
                    return r;
                });
                return (c.filter(c => {
                    return null !== c.var;
                }).length > 0) ? c : [];
            }
        }
    }
</script>

<style scoped>

</style>
