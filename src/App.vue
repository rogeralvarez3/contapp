<template>
  <v-app>
    <v-navigation-drawer app clipped dense v-model="drawer">
      <v-list-item v-for="mn in menu" :key="mn.text">
        <v-list-item-icon>
          <v-icon v-text="mn.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-title v-text="mn.text"></v-list-item-title>
      </v-list-item>
    </v-navigation-drawer>
    <v-app-bar app clipped-left dark dense class="elevation-1">
      <v-app-bar-nav-icon fab text v-if="!drawer" @click="drawer=true">
        <v-icon>mdi-menu</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>
        CONT
        <STRONG>APP</STRONG>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <router-view></router-view>
    </v-main>
    <v-dialog v-model="dlgLogin" width="450" persistent>
      <v-card>
        <v-card-title class="grey lighten-4">
          <v-icon class="mr-1">mdi-lock</v-icon>
          Identifícate
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field label="Usuario:" prepend-inner-icon="mdi-account-circle" v-model="user.name" class="mt-3"></v-text-field>
          <v-text-field label="Contraseña:" prepend-inner-icon="mdi-account-key" v-model="user.password" ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="grey lighten-4">
          <v-spacer></v-spacer>
          <v-btn fab dark color="blue"><v-icon>mdi-key</v-icon></v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import io from "socket.io-client"
export default {
  name: "App",
  data: () => ({
    drawer:undefined,
    dlgLogin:true,
    user:{name:'',pass:''},
    menu:[
      {text:"Comp. de diario",icon:"mdi-text-box",action:null},
      {text:"Comp. de cheques",icon:"mdi-cash-100",action:null},
      {text:"Catálogo",icon:"mdi-book",action:null},
      {text:"Informes",icon:"mdi-chart-bar",action:null},
      {text:"Opciones",icon:"mdi-cogs",action:null},
      {text:"Salir",icon:"mdi-close",action:null},
    ]
  }),
  methods:{},
  computed:{},
  mounted:function(){
    var mv=this
    var socket = io(mv.$store.state.api)
    socket.on("save",data=>{
      console.log(data)
    })
    socket.on("delete",data=>{
      console.log(data)
    })
    mv.$store.commit("setVariable",{variable:"socket",data:socket})
  }
};
</script>
