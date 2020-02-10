<template>
    <div :id="tableReference" class="border-0 bootstrap-data-table">
        <table-top :general-search="GeneralSearch" :page-sizes="pageSizes" @countChanged="newPageSize" @searched="realSearch"/>
        <div class="table-responsive">
            <table class="table">
                <table-head :table-ref="tableReference" :columns="cleanColumns" @searched="prepareSearch" v-if="columns.length>0"/>
                <table-body :page-variable="checkboxVariable" :start-index="startIndex" :table-ref="tableReference" :columns="cleanColumns" :data="filteredData"/>
            </table>
        </div>
        <pagination :total="totalData" :per-page="perPage" :page="activePage" @paged="newPage"/>
        <div class="d-flex justify-content-center align-items-center overlay" v-if="loading">
            <i class="fa fa-cog fa-spin"/>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import Pagination from "./datatable/Pagination";
    import TableBody from "./datatable/TableBody";
    import TableHead from "./datatable/TableHead";
    import TableTop from "./datatable/TableTop";
    import {tableFunctions} from "./datatable/bootstrapTableStore";
    import axios from 'axios';

    export default {
        name: "DataTable",
        props: {
            GeneralSearch: {type: Boolean, default: true},
            columns: {
                type: Array, default() {
                    return [];
                }
            },
            data: {
                type: Array, default() {
                    return [];
                }
            },
            apiUrl: {type: String, default: null},
            pageSizes: {
                type: Array, default() {
                    return [10, 30, 50, 100];
                }
            }
        },
        data() {
            return {
                tableReference: null, activePage: 1, perPage: 10, lastUrl: this.apiUrl,
                rawData: [], serverData: false, tempPage: 1, totalData: 0, loading: false,
                searchParams: {}, searched: false, startIndex: 0, rowSelections: [], allRowsSelected: false
            }
        },
        methods: {
            realSearch(q) {
                this.searchParams = Object.assign({}, this.searchParams, q);
                this.loadData();
            },
            prepareSearch(q) {
                this.searchParams = Object.assign({}, this.searchParams, q);
                this.performSearch(this);
            },
            performSearch: _.debounce((me, url) => {
                me.loadData(url);
            }, 2000),
            newPage(pg, index) {
                this.startIndex = index;
                this.tempPage = parseInt(pg);
                this.loadData();
            },
            newPageSize(pg) {
                this.perPage = parseInt(pg);
                this.loadData();
                this.checkTable();
            },
            checkTable() {
                if (this.serverData) return;
                let tp = Math.ceil(this.totalData / this.perPage);
                if (this.tempPage > tp) this.tempPage = tp;
            },
            loadData(url) {
                if (!this.serverData) return;
                url = url || this.apiUrl;
                this.loading = true;
                url = this.prepareUrl(url);
                axios.get(url)
                    .then(resp => {
                        this.assignServerData(resp.data);
                        this.loading = false;
                    }).catch(error => {
                    console.error(error);
                    this.loading = false;
                });
            },
            assignServerData(resp) {
                if (_.isArray(resp)) {
                    this.rawData = resp;
                    this.totalData = resp.length;
                    return;
                }
                if (!_.isObject(resp)) return;
                this.totalData = _.get(resp, 'total', 0);
                this.rawData = _.get(resp, 'data', []);
            },
            prepareUrl(url) {
                url = tableFunctions.insertParam(url, 'page', this.tempPage);
                url = tableFunctions.insertParam(url, 'per_page', this.perPage);

                Object.entries(this.searchParams).forEach(([key, val]) => {
                    url = tableFunctions.insertParam(url, `search[${key}]`, val);
                });
                return url;
            }
        },
        computed: {
            cleanColumns() {
                return this.columns.filter(c => {
                    return _.has(c, 'name') && (_.isString(c.name) || _.isObject(c.name));
                });
            },
            filteredData() {
                let nData = this.rawData;
                if (!this.serverData) {
                    let si = (this.tempPage - 1) * this.perPage;
                    nData = nData.slice(si, si + this.perPage);
                }
                return nData;
            }, checkboxVariable() {
                let clm = this.cleanColumns.find(c => _.isString(c.name) && c.name.trim().toLowerCase() === tableFunctions.columnCheckbox);
                if (clm === undefined) return null;
                return _.has(clm, 'variable') && _.isString(clm.variable) ? clm.variable : -1;
            }
        },
        components: {
            TableTop, TableHead, TableBody, Pagination
        },
        beforeMount() {
            this.tableReference = _.uniqueId('bdt');
            this.loading = true;
        },
        mounted() {
            _.set(tableFunctions.rowSelections, this.tableReference, []);
            this.serverData = null !== this.apiUrl;
            if (!this.serverData) {
                this.rawData = this.data;
                this.totalData = this.rawData.length;
                this.loading = false;
            } else {
                this.rawData = [];
                this.loadData();
            }
        },
        watch: {
            searchParams() {
                this.tempPage = 1;
            }, filteredData() {
                this.activePage = this.tempPage;
            }
        }
    }
</script>

<style scoped>
    .bootstrap-data-table {
        position: relative;
        min-height: 15rem;
        min-width: 15rem;
    }

    .bootstrap-data-table .overlay {
        position: absolute;
        top: 0;
        width: 100%;
        bottom: 0;
        background-color: #ffffffde;
        z-index: 9;
        font-size: 5rem;
    }
</style>
