<template>
      <div class="q-pa-md tabela">
            <q-table :rows="filteredItems" :columns="columns"
                  v-model:pagination="pagination" row-key="name" :visible-columns="visibleColumns">
                  <template v-slot:top>
                        <p>Roteadores</p>
                        <q-space />

                  </template>

            </q-table>
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
                              name: 'pppoe',
                              required: true,
                              label: 'PPPoE',
                              field: 'pppoe',
                              align: 'left',
                              sortable: true,
                              class: 'rowTeste'
                        },
                        {
                              name: 'mac',
                              required: true,
                              label: 'MAC',
                              field: 'mac',
                              align: 'left',
                              sortable: true
                        },
                        {
                              name: 'date',
                              required: true,
                              label: 'Data',
                              field: 'date',
                              align: 'left',
                              sortable: true
                        },
                        {
                              name: 'observacao',
                              required: true,
                              label: 'Observacao',
                              align: 'left',
                              field: 'observacao',
                              sortable: true
                        },
                  ],
                  pagination: {
                        rowsPerPage: 7
                  }
            }
      },
      setup() {
            document.title = "Controle de roteadores";
      },
      created() {
            this.ListaRotadores();

      },
      methods: {
            ListaRotadores() {
                  let apiURL = import.meta.env.VITE_APIURL;
                  axios.get(apiURL)
                        .then(res => {
                              this.roteadores = res.data
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

<style>
@import './Tabela.css';
</style>