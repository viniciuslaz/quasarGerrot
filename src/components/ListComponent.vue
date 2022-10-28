<template>
      <div class="justify-content-center">
            <div class="row flex justify-end">
                  <div class="col-lg-3">
                        <input type="text" class="q-mb-sm" placeholder="Pesquisar..." v-model="search" />
                  </div>
            </div>
            <div class="row mt-3">
                  <q-table title="Treats" :rows="filteredItems" :columns="columns" row-key="name" />
            </div>
      </div>
</template>
  
<script>
import axios from "axios";
import _ from "lodash";
var imagem;
var classe;

export default {
      data() {
            return {
                  roteadores: [],
                  currentSort: 'name',
                  currentSortDir: 'asc',
                  search: '',
                  columns: [
                        {
                              name: 'name',
                              required: true,
                              label: 'Dessert (100g serving)',
                              align: 'left',
                              field: 'pppoe',
                              format: val => `${val}`,
                              sortable: true
                        },
                  ],
                  pagination: {
                        sortBy: 'Id',
                        descending: false,
                        rowsPerPage: 50
                  }
            }
      },
      setup() {
            document.title = "Controle de roteadores";
      },
      created() {
            console.log("oi");
            this.ListaRotadores();

      },
      methods: {
            ListaRotadores() {
                  let apiURL = import.meta.env.VITE_APIURL;
                  axios.get(apiURL)
                        .then(res => {
                              this.roteadores = res.data
                              console.log(res)
                        })
                        .catch(error => {
                              console.log(error, 'puts')
                        });
            },
            deleteRoteador(id) {
                  let apiURL = import.meta.env.VITE_APIURL + `delete-roteador/${id}`;
                  let indexOfArrayItem = this.roteadores.findIndex(i => i._id === id);

                  if (window.confirm("Deseja remover este roteador?")) {
                        axios.delete(apiURL).then(() => {
                              this.roteadores.splice(indexOfArrayItem, 1)
                        }).catch(error => {
                              console.log(error)
                        })
                  }
            },
            sort: function (s) {
                  if (s === this.currentSort) {
                        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
                  }
                  this.currentSort = s;
            },
            pegarModelo(modelo) {
                  switch (modelo) {
                        case 'tplink':
                              imagem = tplink;
                              return imagem;
                        case 'huawei':
                              imagem = huawei;
                              return imagem;
                        case 'parks':
                              imagem = parks;
                              return imagem;
                        case 'xpon':
                              imagem = xpon;
                              return imagem;
                        case 'datacom':
                              imagem = datacom;
                              return imagem;
                        default:
                              imagem = naoencontrado;
                              return imagem;
                  }
            },
            pegarClass(quantidade) {
                  switch (quantidade) {
                        case '1':
                              classe = "bg-success";
                              return classe;
                        case '2':
                              classe = "bg-warning";
                              return classe;
                        case '3':
                              classe = "bg-danger";
                              return classe;
                  }
            }
      },
      computed: {
            orderedUsers: function () {
                  return _.orderBy(this.roteadores, this.colunaSort, this.colunaOrder)
            },
            filteredItems() {
                  let roteadores = [];
                  roteadores = this.roteadores.filter((router) => {
                        return (
                              router.mac.toLowerCase().indexOf(this.search.toLowerCase()) > -1
                        );
                  });
                  return roteadores;
            },
      }
}
</script>