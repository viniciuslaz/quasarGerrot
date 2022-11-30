<template>
      <q-dialog v-model="confirm">
            <q-card>
                  <q-card-section class="row items-center">
                        <span>Tem certeza que deseja deletar o roteador?</span>
                  </q-card-section>

                  <q-card-actions align="right" :props="props">
                        <q-btn flat label="Cancelar" color="primary" v-close-popup />
                        <q-btn flat label="Excluir" color="red" @click.prevent="deletarRoteador()" v-close-popup />
                  </q-card-actions>
            </q-card>
      </q-dialog>

      <q-dialog v-model="editar" persistent transition-show="scale" transition-hide="scale" class="prioridade">
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
                        <q-btn flat label="ATUALIZAR" color="primary" @click="validaInformacoes(true)" />
                        <q-btn flat label="Cancelar" color="red" v-close-popup />
                  </q-card-actions>
            </q-card>
      </q-dialog>

      <q-dialog v-model="verRoteador" transition-show="scale" transition-hide="scale">
            <q-card class="my-card">
                  <img v-if="modeloRoteador == 'tplink'" src="../assets/tplink-g5.png" alt="TpLink"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'huawei'" src="../assets/huawei.png" alt="Huawei"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'datacom'" src="../assets/datacom.png" alt="Datacom"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'parks'" src="../assets/parks.png" alt="Parks"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'xpon'" src="../assets/xpon.png" alt="Xpon"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'cianet'" src="../assets/cianet.png" alt="Cianet"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'eb01'" src="../assets/eb01.png" alt="Eb01"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'fiberhome'" src="../assets/fiberhome.png" alt="Fiberhome"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'intelbras'" src="../assets/intelbras.png" alt="Intelbras"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'multilaser'" src="../assets/multilaser.png" alt="Multilaser"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'zterouter'" src="../assets/zterouter.png" alt="Zte router"
                        class="roteadorCard">
                  <img v-else-if="modeloRoteador == 'zte'" src="../assets/zte.png" alt="Zte router"
                        class="roteadorCard">
                        <img v-else-if="modeloRoteador == 'datacombridge'" src="../assets/datacomBridge.png" alt="Datacom bridge"
                        class="roteadorCard">
                  <img v-else="modeloRoteador == 'nenhum'" src="../assets/nenhum.png" alt="Huawei"
                        class="roteadorCard">

                  <q-card-section>
                        <div class="text-h6">{{ mac }}</div>
                        <div class="text-subtitle2">{{ pppoe }}</div>
                  </q-card-section>

                  <q-separator />

                  <q-card-actions vertical>
                        <q-btn flat @click="editar = true" v-if="verUmaReincidencia">Reincidencia 1</q-btn>
                        <q-btn flat @click="editar = true" v-if="verDuasReincidencia">Reincidencia 2</q-btn>
                        <q-btn flat @click="editar = true" v-if="verTresReincidencia">Reincidencia 3</q-btn>
                  </q-card-actions>

                  <q-card-actions align="right" class="bg-white text-teal">
                        <q-btn flat label="FECHAR" color="red" v-close-popup @click="limpaVariaveis()" />
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
                              <q-btn flat label="Cancelar" color="red" v-close-popup @click="limpaVariaveis()" />
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

                        <q-btn-dropdown class="botaoCadastrar q-mr-sm" label="Filtrar">
                              <q-list>
                                    <q-item clickable v-close-popup>
                                          <q-item-section>
                                                <q-radio v-model="checkReincidencias" size="md" checked-icon="task_alt"
                                                      unchecked-icon="panorama_fish_eye" val="1"
                                                      label="1 reincidencia" />
                                          </q-item-section>
                                    </q-item>

                                    <q-item clickable v-close-popup>
                                          <q-item-section>
                                                <q-radio v-model="checkReincidencias" size="md" checked-icon="task_alt"
                                                      unchecked-icon="panorama_fish_eye" val="2"
                                                      label="2 reincidencias" />
                                          </q-item-section>
                                    </q-item>

                                    <q-item clickable v-close-popup>
                                          <q-item-section>
                                                <q-radio v-model="checkReincidencias" size="md" checked-icon="task_alt"
                                                      unchecked-icon="panorama_fish_eye" val="3"
                                                      label="3 reincidencias" />
                                          </q-item-section>
                                    </q-item>

                                    <q-item clickable v-close-popup>
                                          <q-item-section>
                                                <q-radio v-model="checkReincidencias" size="md" checked-icon="task_alt"
                                                      unchecked-icon="panorama_fish_eye" val="x" label="Sem filtro" />
                                          </q-item-section>
                                    </q-item>
                              </q-list>
                        </q-btn-dropdown>

                        <button class="botaoCadastrar" @click="cadastrar = true">CADASTRAR</button>
                  </template>

                  <template v-slot:body-cell-modelo="props">
                        <q-td :props="props">
                              <img v-if="props.row.modelo == 'tplink'" src="../assets/tplink-g5.png" alt="TpLink"
                                    class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'huawei'" src="../assets/huawei.png" alt="Huawei"
                                    class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'datacom'" src="../assets/datacom.png" alt="Datacom"
                                    class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'parks'" src="../assets/parks.png" alt="Parks"
                                    class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'xpon'" src="../assets/xpon.png" alt="Xpon"
                                    class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'cianet'" src="../assets/cianet.png" alt="Cianet"
                                    class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'eb01'" src="../assets/eb01.png" alt="Eb01"
                                    class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'fiberhome'" src="../assets/fiberhome.png"
                                    alt="Fiberhome" class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'intelbras'" src="../assets/intelbras.png"
                                    alt="Intelbras" class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'multilaser'" src="../assets/multilaser.png"
                                    alt="Multilaser" class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'zterouter'" src="../assets/zterouter.png"
                                    alt="Zte router" class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'zte'" src="../assets/zte.png" alt="Zte router"
                                    class="modeloRoteador">
                              <img v-else-if="props.row.modelo == 'datacombridge'" src="../assets/datacombridge.jpg" alt="Datacom Bridge"
                                    class="modeloRoteador">
                              <img v-else="props.row.modelo == 'nenhum'" src="../assets/nenhum.png" alt="Huawei"
                                    class="modeloRoteador">
                        </q-td>
                  </template>

                  <template v-slot:body-cell-reincidencia="props">
                        <q-td :props="props">
                              <q-badge v-if="props.row.reincidencia == 1" transparent align="middle" color="green"
                                    class="q-pa-xs">
                                    1 - Reincidencia(s)
                              </q-badge>
                              <q-badge v-else-if="props.row.reincidencia == 2" transparent align="middle" color="orange"
                                    class="q-pa-xs">
                                    2 - Reincidencia(s)
                              </q-badge>
                              <q-badge v-else-if="props.row.reincidencia == 3" transparent align="middle" color="red"
                                    class="q-pa-xs">
                                    3 - Reincidencia(s)
                              </q-badge>
                        </q-td>
                  </template>

                  <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                              <a @click="editarRoteador(props)" class="q-mr-md iconesTabela">
                                    <q-icon name="fa-solid fa-eye" />
                              </a>
                              <a @click="pegaIdDeletar(props)" class="iconesTabela">
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
                              name: "modelo",
                              label: "Modelo",
                              field: "modelo",
                              sortable: true,
                              align: 'center',
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
                              sortable: true,
                              sort: (a,) => parseInt(a, 31)
                        },
                        {
                              name: 'reincidencia',
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
                        rowsPerPage: 6,
                        sortBy: "date",
                        descending: true,
                  }
            }
      },
      setup() {
            document.title = "Controle de roteadores";
            return {
                  dataHoje: ref(''),
                  verRoteador: ref(false),
                  confirm: ref(false),
                  editar: ref(false),
                  cadastrar: ref(false),
                  idRoteador: ref(''),
                  modeloRoteador: ref(''),
                  mac: ref(''),
                  pppoe: ref(''),
                  observacao: ref(''),
                  reincidencia: ref(''),
                  checkReincidencias: ref('x'),
                  verUmaReincidencia: ref(false),
                  verDuasReincidencia: ref(false),
                  verTresReincidencia: ref(false),
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
            validaInformacoes(editado) {
                  if (editado == true) {
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
                        } else if (this.observacao.length <= 8 || this.observacao == null || this.observacao == "") {
                              $q.notify({
                                    type: 'warning',
                                    message: 'Insira uma descrição detalhada de 8 caracteres!'
                              })
                        }
                        else {
                              this.atualizaRoteador()
                        }
                  } else {
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
                        } else if (this.observacao.length <= 8 || this.observacao == null || this.observacao == "") {
                              $q.notify({
                                    type: 'warning',
                                    message: 'Insira uma descrição detalhada de 8 caracteres!'
                              })
                        }
                        else {
                              this.cadastrarRoteador()
                        }
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
                  this.modeloRoteador = "";
                  this.mac = "";
                  this.pppoe = "";
                  this.observacao = "";
                  this.reincidencia = "";
                  this.data = "";
                  this.verUmaReincidencia = false;
                  this.verDuasReincidencia = false;
                  this.verTresReincidencia = false;
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
                        $q.notify({
                              icon: 'done',
                              color: 'negative',
                              message: 'Roteador removido'
                        })
                  }).catch(error => {
                        console.log(error)
                  })
            },
            editarRoteador(props) {
                  this.idRoteador = props.row._id;
                  this.mac = props.row.mac;
                  this.pppoe = props.row.pppoe;
                  this.observacao = props.row.observacao;
                  this.reincidencia = props.row.reincidencia;
                  this.modeloRoteador = props.row.modelo;

                  if(this.reincidencia == 1){
                        this.verUmaReincidencia = true;
                  }else if(this.reincidencia == 2){
                        this.verUmaReincidencia = true;
                        this.verDuasReincidencia = true;
                  }else if(this.reincidencia == 3){
                        this.verUmaReincidencia = true;
                        this.verDuasReincidencia = true;
                        this.verTresReincidencia = true;
                  }
                  this.verRoteador = true;
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
                        this.verRoteador = false;
                        $q.notify({
                              icon: 'done',
                              color: 'positive',
                              message: 'Informações atualizadas'
                        })
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
                                    this.limpaVariaveis();
                                    this.cadastrar = false;
                                    this.ListaRotadores();
                                    $q.notify({
                                          icon: 'done',
                                          color: 'positive',
                                          message: 'Roteador cadastrado'
                                    })
                              }).catch(error => {
                                    console.log(error);
                              })
                        } else {
                              roteador._id = res.data._id;
                              roteador.reincidencia = res.data.reincidencia;
                              axios.put(apiURL + 'save-roteador', roteador).then(() => {
                                    this.limpaVariaveis();
                                    this.cadastrar = false;
                                    this.ListaRotadores();
                                    $q.notify({
                                          icon: 'done',
                                          color: 'positive',
                                          message: 'O roteador já está cadastrado! O número de reincidências foi aumentado!'
                                    }).catch(error => {
                                          console.log(error)
                                    });
                              })
                        }
                  }).catch(error => {
                        console.log(error)
                  });
            },
            pegarModelo(modelo) {
                  console.log(modelo)
                  switch (modelo) {
                        case 'huawei':
                              imagem = "../assets/huawei.png";
                              return imagem;
                  }
            },
      },
      computed: {
            ListaRoteadores() {
                  const filter = this.config.filter;
                  const checkReincidencias = this.checkReincidencias;
                  return this.roteadores.filter((roteador) => {
                        if (checkReincidencias == 1) {
                              return (
                                    (roteador.reincidencia.match(1) &&
                                          roteador.pppoe.match(filter)
                                    ));
                        } else if (checkReincidencias == 2) {
                              return ((
                                    roteador.reincidencia.match(2) &&
                                    roteador.pppoe.match(filter)
                              ));
                        } else if (checkReincidencias == 3) {
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