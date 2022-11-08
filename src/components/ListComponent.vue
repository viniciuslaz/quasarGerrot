<template>
      <div class="q-pa-md tabela">
            <q-table :rows="ListaRoteadores" :columns="columns" v-model:pagination="pagination" row-key="name"
                  :visible-columns="visibleColumns">
                  <template v-slot:top-left>
                        <p class="tituloTabela">Lista de roteadores</p>
                        <q-space />
                  </template>

                  <template v-slot:top-right>
                        <q-btn icon="fa-solid fa-infinity" class="q-mr-xs" flat to="/listar"
                              :color="status == undefined ? 'red' : ''"></q-btn>
                        <q-btn icon="fa-solid fa-signature" class="q-mr-xs" flat to="/listar?reincidencia=2"></q-btn>
                        <q-input borderless dense debounce="300" v-model="config.filter" placeholder="Busca">
                              <template v-slot:append>
                                    <q-icon name="search" />
                              </template>
                        </q-input>
                  </template>

                  <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                              <q-btn icon="fa-solid fa-eye" size="xs" class="q-mr-xs">
                              </q-btn>
                              <q-btn icon="fa-solid fa-trash" size="xs" color="red">
                              </q-btn>
                        </q-td>
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
      props: {
            reincidencia: String,
      },
      data() {
            return {
                  config: {
                        filter: "",
                  },
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
                        {
                              name: 'reincidencia',
                              required: true,
                              label: 'Reincidencias',
                              align: 'left',
                              field: 'reincidencia',
                              sortable: true
                        },
                        { name: "actions" },
                  ],
                  pagination: {
                        rowsPerPage: 10,
                        sortBy: "date",
                        descending: true,
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
                  const filter = this.config.filter.toLowerCase();
                  console.log("Oi", filter)
                  let roteadores = [];
                  roteadores = this.roteadores.filter((router) => {
                        return (
                              router.mac.toLowerCase().indexOf(this.search.toLowerCase()) > -1
                        );
                  });
                  return roteadores;
            },
            ListaRoteadores() {
			const filter = this.config.filter.toLowerCase();
			return this.roteadores.filter((roteador) => {
				if (this.reincidencia == undefined) {
					return (
						roteador.pppoe.match(filter) ||
                                    roteador.mac.match(filter) ||
                                    roteador.mac.toLowerCase().match(filter) ||
                                    roteador.date.match(filter)
					);
				} else {
					return (
						(roteador.pppoe.match(filter)
					));
				}
			}).slice(0, 100);
		},
      }
}
</script>

<style>
@import './Tabela.css';
</style>