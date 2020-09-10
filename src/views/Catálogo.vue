<template>
  <v-container>
    <v-card>
      <v-card-title class="grey lighten-4 pa-0 pl-2"
        ><v-icon>mdi-book</v-icon>Catálogo de cuentas<v-spacer></v-spacer>
        <div width="300">
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            placeholder="Buscar"
            v-model="buscar"
            dense
            hide-details
            outlined
            class="ma-1"
          ></v-text-field>
        </div>
        <v-btn fab small dark color="primary" class="mr-1" @click="dlgAdd=true"
          ><v-icon small>mdi-plus</v-icon></v-btn
        >
        <v-btn fab small dark color="red" @click="$router.push('/')"
          ><v-icon small>mdi-close</v-icon></v-btn
        ></v-card-title
      >
      <v-divider></v-divider>
      <v-card-text>
        <v-container>
          <v-treeview
            :items="catálogo"
            item-key="cuenta"
            item-text="fulltext"
            item-children="subcuentas"
            activatable
            open-on-click
            hoverable
            dense
            :search="buscar"
            open-all
            shaped
          >
            <template v-slot:prepend="{ item, open }">
              <div row>
                <v-icon v-if="item.subcuentas" color="warning">
                  {{ open ? "mdi-folder-open" : "mdi-folder" }}
                </v-icon>
                <v-icon v-else color="primary">
                  mdi-file
                </v-icon>
                {{ `${item.cuenta} `
                }}<strong>{{
                  item.descripción
                }}</strong>
                <v-btn fab small text dark color="red" style="float:right;" class="elevation-0" @click="borrar(item.cuenta)">
                  <v-icon small>mdi-close</v-icon>
                </v-btn>
              </div>
            </template>
          </v-treeview>
        </v-container>
      </v-card-text>
    </v-card>
    <v-dialog v-model="dlgAdd" width="500">
      <v-card>
        <v-card-title class="grey lighten-4 pa-0 pl-2">
          Agregar cuenta
          <v-spacer></v-spacer>
          <v-btn fab dark color="red" small @click="dlgAdd=false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field label="Cuenta" dense class="pt-4" v-model="nuevaCuenta.cuenta" v-mask="'#-#-#-##'"></v-text-field>
          <v-text-field label="Descripción" dense v-model="nuevaCuenta.descripción"></v-text-field>
          <v-layout row class="pl-3 pr-3">
            <v-select label="Tipo" dense v-model="nuevaCuenta.tipo" class="pr-2 right-text" :items="[{value:1,text:'Balance general'},{value:2,text:'Estado de resultado'}]" :disabled="!isRoot()"></v-select>
            <v-select label="Naturaleza" dense v-model="nuevaCuenta.naturaleza" class="text-right" :items="[{value:1,text:'Deudora'},{value:2,text:'Acreedora'}]" :disabled="!isRoot()"></v-select>
          </v-layout>
          <v-layout row class="pl-3 pr-3">
            <v-text-field label="Saldo debe" dense v-model="nuevaCuenta.debe" class="pr-2 right-text"></v-text-field>
          <v-text-field label="Saldo haber" dense v-model="nuevaCuenta.haber" class="text-right"></v-text-field>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="grey lighten-3 pa-2">
          <v-spacer></v-spacer>
          <v-btn color="primary" small @click="guardar()">aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {catálogo} from "../../utils"
export default {
  data() {
    return {
      buscar: "",
      dlgAdd:false,
      nuevaCuenta:{cuenta:'',descripción:'',tipo:null,naturaleza:null,debe:0,haber:0}
    };
  },
  watch:{
    dlgAdd(val){
      if(!val){
        this.nuevaCuenta.cuenta=''
        this.nuevaCuenta.descripción=''
        this.nuevaCuenta.tipo=null
        this.nuevaCuenta.naturaleza=null
        this.nuevaCuenta.debe=0
        this.nuevaCuenta.haber=0
      }
    }
  },
  methods: {
    isRoot:function(){
      let mv= this
      if(mv.nuevaCuenta.cuenta.length==0){return false}
      let m=mv.nuevaCuenta.cuenta.split('-')
      let suma=0
      for(var i=1;i<m.length;i++){
        let valor=m[i]
        if(!valor){valor=0}
        suma+=parseInt(valor)
      }
      if(suma===0){
        return true
      }else{
        let cta=mv.$store.state.catálogo[mv.$store.state.catálogo.findIndex(c=>{let m2=c.cuenta.split('-');return m[0]==m2[0]})]
        mv.nuevaCuenta.tipo=cta.tipo
        mv.nuevaCuenta.naturaleza=cta.naturaleza
        return false
      }
    },
    guardar:function(){
      var mv = this;
      let data = JSON.stringify({table:'catálogo',data:mv.nuevaCuenta})
      fetch(`${mv.$store.state.api}/save`,{method:'post',body:data,headers:{'content-type':'application/json'}})
      .then(json=>{return json.json()})
      .then(r=>{//console.log(r);
        if(r.errno){
          mv.$swal.fire({icon:'error',title:'Error al guardar',text:r.sqlMessage})
        }else{
          mv.$swal.fire({icon:'success',title:'Cuenta agregada correctamente',toast:true,position:'bottom-end',timer:mv.$store.state.alertDisplayTime})
          mv.$store.dispatch('getData', {tabla:'catálogo',variable:'catálogo'})
          mv.dlgAdd=false
        }
      })
    },
    borrar:function(cuenta){
      var mv = this;
      mv.$swal({
        icon:'warning',
        title:'Borrar cuenta',
        text:'¿Desea borrar la cuenta seleccionada?',
        confirmButtonText:'Si',
        confirmButtonColor:'red',
        showCancelButton:true,
      }).then(confirm=>{
        if(confirm.value){
          //console.log('se hizo click en sí')
          let data = JSON.stringify({
            tabla:'catálogo',
            condición:`cuenta='${cuenta}'`
          })
          fetch(`${mv.$store.state.api}/delete`,{method:'post',headers:{'content-type':'application/json'},body:data})
          .then(json=>{return json.json()})
          .then(r=>{
            if(r.errno){
              mv.$swal({icon:'error',title:'Error al borrar',text:r.sqlMessage})
            }else{
              mv.$swal.fire({icon:'success',title:'Cuenta borrada correctamente',toast:true,position:'bottom-end',timer:mv.$store.state.alertDisplayTime})
              mv.$store.dispatch('getData', {tabla:'catálogo',variable:'catálogo'})
            }
          })
        }
      })
    }
  },
  computed: {
    catálogo: function() {
      var mv = this;
      return catálogo(mv.$store.state.catálogo);
    },
  },
};
</script>

