<template>
    <tr>
        <td v-for="column in columns">
            <template v-if="null!==column.var">
                <select v-if="column.options.length>0" class="form-control-sm form-control rounded-0 search-control" @input="emitSearch(column.var,$event.target.value)">
                    <option></option>
                    <option v-for="opt in column.options" :value="opt">{{opt}}</option>
                </select>
                <input class="form-control form-control-sm search-control rounded-0" type="search" @input="emitSearch(column.var,$event.target.value)" v-else>
            </template>
        </td>
    </tr>
</template>

<script>
    export default {
        name: "ColumnSearch",
        props: {
            columns: {type: Array, required: true},
        }, data() {
            return {searches: {}}
        }, methods: {
            emitSearch(name, value) {
                this.searches = _.set(this.searches, name, value);
                this.$emit('searched', this.searches);
            }
        }, mounted() {
        }
    }
</script>

<style scoped>
    .search-control {
        min-width: 5rem;
        padding: 0.25rem 0.25rem;
        border-radius: 0;
    }
</style>
