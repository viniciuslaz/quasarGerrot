<template>
      <q-dialog v-model="confirm">
            <q-card>
                  <q-card-section class="row items-center">
                        <span class="q-ml-sm">Tem certeza que deseja deletar o roteador?</span>
                  </q-card-section>

                  <q-card-actions align="right" :props="props">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup />
                        <q-btn flat label="Excluir" color="red" @click.prevent="deletarRoteador()" v-close-popup />
                  </q-card-actions>
            </q-card>
      </q-dialog>

      <q-dialog v-model="medium" persistent transition-show="scale" transition-hide="scale">
            <q-card class="q-pa-sm" style="width: 400px">
                  <div class="tituloEditaRoteador">Editar roteador:</div>

                  <q-input outlined class="q-mb-md" v-model="mac" label="Mac:">
                        <template v-slot:append>
                              <q-icon name="close" @click="mac = ''" class="cursor-pointer" />
                        </template>
                  </q-input>
                  <q-input outlined class="q-mb-md" v-model="pppoe" label="PPPoE:">
                        <template v-slot:append>
                              <q-icon name="close" @click="pppoe = ''" class="cursor-pointer" />
                        </template>
                  </q-input>
                  <q-input v-model="dataHoje" class="q-mb-md" outlined label="Data:" disable />
                  <q-input outlined class="q-mb-md" v-model="reincidencia" label="Reincidencias:" disable />

                  <q-input v-model="observacao" outlined autogrow label="Obs:" />

                  <q-card-actions align="right" class="bg-white text-teal">
                        <q-btn flat label="ATUALIZAR" color="primary" v-close-popup @click="atualizaRoteador()" />
                        <q-btn flat label="Cancelar" color="red" v-close-popup @click="limpaVariaveis()" />
                  </q-card-actions>
            </q-card>
      </q-dialog>

      <q-dialog v-model="cadastrar" persistent transition-show="scale" transition-hide="scale">
            <q-card class="q-pa-sm" style="width: 400px">
                  <div class="tituloEditaRoteador">Cadastrar roteador:</div>

                  <q-input outlined class="q-mb-md" v-model="mac" label="Mac:" required minlength="12" v-maska="'XX:XX:XX:XX:XX:XX'">
                        <template v-slot:append>
                              <q-icon name="close" @click="mac = ''" class="cursor-pointer" />
                        </template>
                  </q-input>
                  <q-input outlined class="q-mb-md" v-model="pppoe" label="PPPoE:">
                        <template v-slot:append>
                              <q-icon name="close" @click="pppoe = ''" class="cursor-pointer" />
                        </template>
                  </q-input>
                  <q-input v-model="dataHoje" class="q-mb-md" outlined label="Data:" disable />

                  <q-input v-model="observacao" outlined autogrow label="Obs:" />

                  <q-card-actions align="right" class="bg-white text-teal">
                        <q-btn flat label="CADASTRAR" color="primary" v-close-popup @click="cadastrarRoteador()" />
                        <q-btn flat label="Cancelar" color="red" v-close-popup />
                  </q-card-actions>
            </q-card>
      </q-dialog>

      <div class="q-pa-md tabela">
            <q-table :rows="ListaRoteadores" :columns="columns" v-model:pagination="pagination" row-key="name">
                  <template v-slot:top-left>
                        <p class="tituloTabela">Lista de roteadores</p>
                        <q-space />
                  </template>

                  <template v-slot:top-right>
                        <q-input borderless dense debounce="300" v-model="config.filter" placeholder="Busca">
                              <template v-slot:append>
                                    <q-icon name="search" />
                              </template>
                        </q-input>
                        <q-btn icon-right="fa-regular fa-add" class="q-ml-xs" flat @click="cadastrar = true"></q-btn>
                  </template>

                  <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                              <q-btn icon="fa-solid fa-pencil" size="xs" color="primary" @click="editarRoteador(props)"
                                    class="q-mr-xs" />
                              <q-btn icon="fa-solid fa-trash" size="xs" color="red" @click="pegaIdDeletar(props)">
                              </q-btn>
                        </q-td>
                  </template>

            </q-table>
      </div>
</template>
  
<script>
import axios from "axios";
import { ref } from 'vue'
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
                  dataHoje: '',
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
            return {
                  dataHoje: ref(''),
                  medium: ref(false),
                  confirm: ref(false),
                  cadastrar: ref(false),
                  idRoteador: ref(''),
                  mac: ref(''),
                  pppoe: ref(''),
                  observacao: ref(''),
                  reincidencia: ref(''),
            }
      },
      created() {
            this.ListaRotadores();
            this.pegaDataHoje();

      },
      methods: {
            pegaDataHoje() {
                  let hoje = new Date()
                  this.dataHoje = hoje.toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric'
                  })
            },
            limpaVariaveis() {
                  this.idRoteador = "";
                  this.mac = "";
                  this.pppoe = "";
                  this.observacao = "";
                  this.reincidencia = "";
                  this.data = "";
            },
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
            pegaIdDeletar(props) {
                  this.idRoteador = props.row._id;
                  this.confirm = true;
            },
            deletarRoteador() {
                  let id = this.idRoteador;
                  let apiURL = import.meta.env.VITE_APIURL + `delete-roteador/${id}`;

                  let indexOfArrayItem = this.roteadores.findIndex(i => i._id === id);

                  axios.delete(apiURL).then(() => {
                        this.roteadores.splice(indexOfArrayItem, 1);
                        this.limpaVariaveis();
                  }).catch(error => {
                        console.log(error)
                  })
            },
            editarRoteador(props) {
                  this.idRoteador = props.row._id;
                  this.mac = props.row.mac;
                  this.pppoe = props.row.pppoe;
                  this.observacao = props.row.observacao;
                  this.reincidencia = props.row.reincidencia
                  this.medium = true;
            },
            atualizaRoteador() {
                  let apiURL = import.meta.env.VITE_APIURL + `update-roteador/${this.idRoteador}`;

                  let roteador = {}
                  for (var i = 0; i < this.roteadores.length; i++) {
                        if (this.roteadores[i]._id === this.idRoteador) {
                              roteador = this.roteadores[i];
                        }
                  }

                  roteador.pppoe = this.pppoe;
                  roteador.mac = this.mac;
                  roteador.observacao = this.observacao;

                  axios.put(apiURL, roteador).then(() => {
                        this.limpaVariaveis();
                  }).catch(error => {
                        console.log(error)
                  })
            },
            cadastrarRoteador() {
                  let apiURL = import.meta.env.VITE_APIURL;

                  let roteador = {
                        mac: '',
                        pppoe: '',
                        date: '',
                        modelo: '',
                        observacao: '',
                        reincidencia: ''
                  }

                  roteador.pppoe = this.pppoe;
                  roteador.mac = this.mac;
                  roteador.observacao = this.observacao;
                  roteador.date = this.dataHoje;

                  axios.get(apiURL + `get-roteador/${this.mac}`).then(res => {
                        if (res.data == null) {
                              axios.post(apiURL + 'create-roteador', roteador).then(() => {
                                    roteador = {
                                          mac: '',
                                          pppoe: '',
                                          date: '',
                                          modelo: '',
                                          observacao: '',
                                          reincidencia: ''
                                    }
                              }).catch(error => {
                                    console.log(error);
                              })
                        } else {
                              alert("O roteador já está cadastrado! O número de reincidências foi aumentado!")
                              axios.put(apiURL + 'save-roteador', res).then(() => {
                                    roteador = {
                                          mac: '',
                                          pppoe: '',
                                          date: '',
                                          modelo: '',
                                          observacao: '',
                                          reincidencia: ''
                                    }
                              })
                        }
                  }).catch(error => {
                        console.log(error)
                  });
            }
      },
      computed: {
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