<template>
  <v-container>
    <v-card width="800" height="700">
      <v-card-title class="grey lighten-4 pa-0 pl-2"
        >Comprobantes de diario <v-spacer></v-spacer
        ><v-btn
          small
          fab
          color="success"
          :disabled="suma.debe != suma.haber || comp.children.data.length == 0"
          class="mr-1"
          @click="guardar();"
          ><v-icon small>mdi-content-save</v-icon></v-btn
        >
        <v-btn small fab dark color="purple" class="mr-1" @click="dlgBuscaComprobante=true"
          ><v-icon small>mdi-magnify</v-icon></v-btn
        >
        <v-btn small fab dark color="red"
          ><v-icon small>mdi-close</v-icon></v-btn
        ></v-card-title
      >

      <v-divider></v-divider>
      <v-card-text>
        <div>
          <v-layout>
            <v-text-field
              label="Fecha:"
              type="date"
              v-model="comp.fecha"
              dense
              class="short mr-2"
            ></v-text-field>
            <v-text-field
              label="Número:"
              v-model="comp.número"
              dense
              class="short"
            ></v-text-field>
          </v-layout>
          <v-text-field
            label="Concepto:"
            v-model="comp.concepto"
            dense
          ></v-text-field>
          <v-card>
            <v-card-title class="grey lighten-4 pa-0 pl-2"
              >Detalle del comprobante <v-spacer></v-spacer
              ><v-btn small dark fab color="blue" @click="dlgNuevaCuenta = true"
                ><v-icon small>mdi-plus</v-icon></v-btn
              ></v-card-title
            >
            <v-divider></v-divider>
            <v-card-text>
              <v-simple-table dense fixed-header>
                <thead>
                  <tr>
                    <th>Cuenta</th>
                    <th>Descripción</th>
                    <th class="text-right">Débito</th>
                    <th class="text-right">Crédito</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(mov, i) in comp.children.data" :key="i">
                    <td>{{ mov.cuenta }}</td>
                    <td>
                      {{
                        $store.getters.dlookup({
                          tabla: "catálogo",
                          campo: "cuenta",
                          texto: mov.cuenta,
                        }).descripción
                      }}
                    </td>
                    <td class="text-right">
                      {{ parseFloat(mov.debe).toFixed(2) }}
                    </td>
                    <td class="text-right">
                      {{ parseFloat(mov.haber).toFixed(2) }}
                    </td>
                    <td>
                      <v-btn color="error" small dark text
                        ><v-icon small>mdi-close</v-icon></v-btn
                      >
                    </td>
                  </tr>
                </tbody>
                <tfoot
                  v-if="comp.children.data.length > 0"
                  class="blue-grey darken-2 white--text"
                >
                  <tr>
                    <th colspan="2" class="text-right">TOTAL</th>
                    <th class="text-right">
                      {{ parseFloat(suma.debe).toFixed(2) }}
                    </th>
                    <th class="text-right">
                      {{ parseFloat(suma.haber).toFixed(2) }}
                    </th>
                    <th></th>
                  </tr>
                </tfoot>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog width="500" v-model="dlgNuevaCuenta" persistent>
      <v-card>
        <v-card-title class="grey lighten-4 pa-1 pl-2"
          >Agregar movimiento</v-card-title
        >
        <v-divider></v-divider>
        <v-card-text>
          <v-container>
            <v-autocomplete
              dense
              label="Cuenta"
              :items="$store.getters.cuentasDetalle()"
              v-model="nuevaCuenta.cuenta"
              item-value="cuenta"
              item-text="fulltext"
              no-data-text="Sin resultados"
              required
            ></v-autocomplete>
            <v-text-field
              v-model="nuevaCuenta.concepto"
              dense
              label="Concepto:"
              required
            ></v-text-field>
            <v-text-field
              type="number"
              v-model="nuevaCuenta.monto"
              dense
              label="Monto:"
              class="short"
              required
            ></v-text-field>
            <v-select
              dense
              label="Movimiento:"
              v-model="nuevaCuenta.movimiento"
              :items="[
                { value: 0, text: 'Débito' },
                { value: 1, text: 'Crédito' },
              ]"
              class="short"
            ></v-select>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="grey lighten-4">
          <v-spacer></v-spacer>
          <v-btn small @click="agregarMovimiento()" color="primary"
            >Agregar</v-btn
          >
          <v-btn small @click="dlgNuevaCuenta = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dlgBuscaComprobante" width="800" persistent>
      <v-card>
        <v-card-title class="grey lighten-4 pa-1 pl-2">
          <v-spacer></v-spacer>
          <v-text-field
            v-model="buscar"
            placeholder="Buscar comprobante"
            outlined
            rounded
            dense
            append-icon="mdi-magnify"
            hide-details
            class="short"
          ></v-text-field>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-simple-table dense fixed-header height="300">
            <thead>
              <tr>
                <th>Id</th>
                <th>Fecha</th>
                <th>Número</th>
                <th>Concepto</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="comp in $store.getters.filtro({variable:'comprobantes',textBuscado:buscar})" :key="comp.id">
                <th>{{comp.id}}</th>
                <th>{{comp.fecha}}</th>
                <th>{{comp.número}}</th>
                <th>{{comp.concepto}}</th>
                <th>{{comp.monto}}</th>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="grey lighten-4">
          <v-spacer></v-spacer>
          <v-btn dark color="primary" small>Aceptar</v-btn>
          <v-btn @click="dlgBuscaComprobante=false" small>Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      comp: { fecha: "", número: "", concepto: "", children: {data:[],table:"detalle de comprobante diario",parentId:'Id de comprobante'} },
      nuevaCuenta: { cuenta: "", concepto: "", monto: "", movimiento: 0 },
      dlgNuevaCuenta: false,
      dlgBuscaComprobante:false,
      buscar:''
    };
  },
  methods: {
    agregarMovimiento: function() {
      var mv = this;
      if (
        mv.nuevaCuenta.cuenta == "" ||
        mv.nuevaCuenta.concepto == "" ||
        mv.nuevaCuenta.monto == 0
      ) {
        mv.$swal({
          icon: "error",
          title: "Todos los campos son requeridos",
          position: "bottom",
          timer: 1500,
          showConfirmButton: false,
          toast: true,
        });
        return;
      }
      var cuenta = {
        cuenta: mv.nuevaCuenta.cuenta,
        concepto: mv.nuevaCuenta.concepto,
      };
      if (this.nuevaCuenta.movimiento == 0) {
        cuenta.debe = mv.nuevaCuenta.monto;
        cuenta.haber = 0;
      } else {
        cuenta.debe = 0;
        cuenta.haber = mv.nuevaCuenta.monto;
      }
      mv.comp.children.data.push(cuenta);
      mv.nuevaCuenta = { cuenta: "", concepto: "", monto: "", movimiento: 0 };
    },
    guardar:function(){
      var mv = this;
      let data = JSON.stringify(
        {table:'comprobantes de diario',data:mv.comp}
      )
      fetch(`${mv.$store.state.api}/save`,{method:'post',headers:{'content-type':'application/json;charset=utf-8'},body:data})
      .then(json=>{return json.json()})
      .then(r=>{
        if(r.errno){
          console.log(r)
        }else{
          mv.$swal.fire({icon:'success',title:'Comprobante guardado!!!',toast:true,position:'top-end',timer:3000})
        }
      })
    }
  },
  computed: {
    suma: function() {
      var mv = this;
      if (mv.comp.children.data.length === 0) {
        return { debe: 0, haber: 0 };
      }
      return mv.comp.children.data.reduce((a, b) => {
        return {
          debe: parseFloat(a.debe) + parseFloat(b.debe),
          haber: parseFloat(a.haber) + parseFloat(b.haber),
        };
      });
    },
  },
};
</script>

<style scoped>
/deep/ .short {
  width: 200px;
}
</style>
