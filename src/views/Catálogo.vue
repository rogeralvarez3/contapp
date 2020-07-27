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
        <v-btn fab small dark color="primary" class="mr-1"
          ><v-icon small>mdi-plus</v-icon></v-btn
        >
        <v-btn fab small dark color="red"
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
                <v-icon v-if="item.subcuentas">
                  {{ open ? "mdi-folder-open" : "mdi-folder" }}
                </v-icon>
                <v-icon v-else>
                  mdi-file
                </v-icon>
                  {{ item.cuenta }}&nbsp;<strong>{{ item.subcuentas?item.descripción.toUpperCase():item.descripción.toLowerCase() }}</strong>
                </div>

            </template>
          </v-treeview>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      buscar: "",   
    };
  },
  methods: {},
  computed: {
    catálogo: function() {
      var mv = this;
      return mv.$store.state.catálogo;
    },
  },
};
</script>

<style>
.v-treeview-node__label {
  display: none;
}
</style>
