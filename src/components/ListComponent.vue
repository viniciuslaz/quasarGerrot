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

                  <form @submit.prevent.stop="validaInformacoes" @reset.prevent.stop="onReset" class="q-gutter-md">
                        <q-input outlined class="q-mb-md" v-model="mac" label="Mac:" type="text"
                              mask="XX:XX:XX:XX:XX:XX">
                              <template v-slot:append>
                                    <q-icon name="close" @click="mac = ''" class="cursor-pointer" />
                              </template>
                        </q-input>
                        <q-input outlined class="q-mb-md" v-model="pppoe" label="PPPoE:" type="text">
                              <template v-slot:append>
                                    <q-icon name="close" @click="pppoe = ''" class="cursor-pointer" />
                              </template>
                        </q-input>
                        <q-input v-model="dataHoje" class="q-mb-md" outlined label="Data:" disable />

                        <q-input v-model="observacao" outlined autogrow label="Obs:" type="text" />

                        <q-card-actions align="right" class="bg-white text-teal">
                              <q-btn flat label="CADASTRAR" color="primary" type="submit" />
                              <q-btn flat label="Cancelar" color="red" v-close-popup />
                        </q-card-actions>
                  </form>
            </q-card>
      </q-dialog>

      <div class="busca">
            <div class="campoBusca">
                  <q-input outlined color="grey" dense v-model="config.filter" placeholder="Busca">
                        <template v-slot:append>
                              <q-icon name="search" />
                        </template>
                  </q-input>
            </div>
      </div>

      <div class="tabela">
            <q-table :rows="ListaRoteadores" :columns="columns" v-model:pagination="pagination" row-key="name"
                  no-data-label="Nenhum resultado encontrado">
                  <template v-slot:top-left>
                        <p class="tituloTabela">Lista de roteadores</p>
                        <q-space />
                  </template>

                  <template v-slot:top-right>
                        <q-checkbox v-model="checkUmaReincidencias" label="1 reincidencias" class="q-mr-lg" />
                        <q-checkbox v-model="checkDuasReincidencias" label="2 reincidencias" class="q-mr-lg" />
                        <q-checkbox v-model="checkTresReincidencias" label="3 reincidencias" class="q-mr-lg" />

                        <q-btn icon-right="fa-regular fa-add" class="q-ml-xs" flat @click="cadastrar = true"></q-btn>
                  </template>

                  <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                              <a @click="editarRoteador(props)" class="q-mr-xs q-pa-xs iconesTabela">
                                    <q-icon name="fa-solid fa-pencil" />
                              </a>
                              <a @click="pegaIdDeletar(props)" class="q-pa-xs iconesTabela">
                                    <q-icon name="fa-solid fa-trash" />
                              </a>
                        </q-td>
                  </template>
            </q-table>
      </div>
</template>
  
<script>
import axios from "axios";
import { ref } from 'vue'
import _ from "lodash";
import { useQuasar } from 'quasar';
let $q;


import huawei from "../assets/huawei.png";
import parks from "../assets/parks.png";
import tplink from "../assets/tplink-g5.png";
import xpon from "../assets/xpon.png";
import datacom from "../assets/datacom.png";
import naoencontrado from "../assets/nenhum.png";
var imagem;

export default {
      props: {
            reincidencia: String,
      },
      data() {
            return {
                  config: {
                        filter: ""
                  },
                  roteadores: [],
                  currentSort: 'name',
                  currentSortDir: 'asc',
                  search: '',
                  dataHoje: '',
                  columns: [
                        {
                              name: 'modelo',
                              required: true,
                              field: (row) => this.pegarModelo(row.modelo),
                              align: 'left',
                        },
                        {
                              name: 'pppoe',
                              required: true,
                              label: 'PPPoE',
                              field: 'pppoe',
                              align: 'left',
                              sortable: true,
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
                              name: 'reincidencias',
                              required: true,
                              label: 'Reincidencias',
                              align: 'left',
                              field: 'reincidencia',
                              sortable: true
                        },
                        {
                              name: "actions",
                              align: "center"
                        },
                  ],
                  pagination: {
                        rowsPerPage: 7,
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
                  checkUmaReincidencias: ref(false),
                  checkDuasReincidencias: ref(false),
                  checkTresReincidencias: ref(false),
            }
      },
      created() {
            this.ListaRotadores();
            this.pegaDataHoje();

      },
      mounted() {
            $q = useQuasar();
      },
      methods: {
            validaInformacoes() {
                  if (this.mac.length != 17) {
                        $q.notify({
                              type: 'warning',
                              message: 'MAC está incompleto!'
                        })
                  } else if (this.pppoe.length < 8 || this.pppoe == null || this.pppoe == "") {
                        $q.notify({
                              type: 'warning',
                              message: 'PPPoE não possui 8 caracteres!'
                        })
                  } else if (this.observacao.length <= 30 || this.observacao == null || this.observacao == "") {
                        $q.notify({
                              type: 'warning',
                              message: 'Insira uma descrição detalhada de 30 caracteres!'
                        })
                  }
                  else {
                        this.cadastrarRoteador()
                  }
            },
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
            pegarModelo(modelo) {
                  switch (modelo) {
                        case 'tplink':
                              imagem = tplink;
                              var img = document.createElement('div');
                              document.body.appendChild(img)
                              img.innerHTML = "<img src='./src/assets/tplink-g5.png'></img>";
                              return
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
                                    this.limpaVariaveis();
                                    this.cadastrar = false;
                                    $q.notify({
                                          icon: 'done',
                                          color: 'positive',
                                          message: 'Roteador cadastrado'
                                    })
                                    this.ListaRoteadores();
                              }).catch(error => {
                                    console.log(error);
                              })
                        } else {
                              let editaObservacao = "";
                              let observacaoNova = this.observacao;
                              let observacaoRegistrada = res.data.observacao;
                              editaObservacao = "1 - " + observacaoRegistrada + ". 2 - " + observacaoNova;
                              res.data.observacao = editaObservacao;
                              axios.put(apiURL + 'save-roteador', res).then(() => {
                                    roteador = {
                                          mac: '',
                                          pppoe: '',
                                          date: '',
                                          modelo: '',
                                          observacao: '',
                                          reincidencia: ''
                                    }
                                    this.limpaVariaveis();
                                    this.cadastrar = false;
                                    $q.notify({
                                          icon: 'done',
                                          color: 'positive',
                                          message: 'O roteador já está cadastrado! O número de reincidências foi aumentado!'
                                    })
                                    this.ListaRoteadores();
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
                  const checkUmaReincidencia = this.checkUmaReincidencias;
                  const checkDuasReincidencia = this.checkDuasReincidencias;
                  const checkTresReincidencia = this.checkTresReincidencias;
                  return this.roteadores.filter((roteador) => {
                        if (checkUmaReincidencia == true) {
                              return (
                                    (roteador.reincidencia.match(1) &&
                                          roteador.pppoe.match(filter)
                                    ));
                        } else if (checkDuasReincidencia == true) {
                              return ((
                                    roteador.reincidencia.match(2) &&
                                    roteador.pppoe.match(filter)
                              ));
                        } else if (checkTresReincidencia == true) {
                              return ((
                                    roteador.reincidencia.match(3) &&
                                    roteador.pppoe.match(filter)
                              ));
                        } else {
                              return (
                                    (roteador.pppoe.match(filter) ||
                                          roteador.mac.match(filter) ||
                                          roteador.date.match(filter)
                                    ));
                        }
                  }).slice(0, 200);
            },
      }
}
</script>

<style>
@import './Tabela.css';
</style>