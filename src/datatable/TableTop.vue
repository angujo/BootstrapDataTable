<template>
    <div class="row justify-content-between align-items-center">
        <div class="col-sm-12 col-md-auto">
            <label class="d-inline d-flex flex-nowrap align-items-center">
                <span class="mr-2">Show</span>
                <select class="form-control form-control-sm form-inline d-inline rounded-0" @input="$emit('countChanged',$event.target.value)">
                    <option v-for="s in pageSizes" :value="s">{{s}}</option>
                </select>
            </label>
        </div>
        <div class="col-sm-12 col-md-auto">
            <div class="d-flex justify-content-end align-items-center">
                <label class="d-flex justify-content-end align-items-center">
                    <span class="mr-2">Search</span>
                    <div class="search-area d-flex justify-content-start align-items-center flex-nowrap">
                        <input type="search" class="form-control-sm form-control form-inline d-inline border-0 rounded-0 search-control" v-model="s._q">
                        <button type="button" class="btn btn-sm" @click="$emit('searched',s)"><i class="bx bx-search"></i></button>
                    </div>
                </label>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "TableTop",
        props: {pageSizes: {type: Array, required: true}},
        data() {
            return {s: {_q: null}}
        }
    }
</script>

<style scoped>
    .search-area {
        border: 1px solid #CCCCCC;
    }

    .search-control {
        min-width: 8rem;
        padding: 0.25rem 0.25rem;
        border-radius: 0;
    }
</style>
