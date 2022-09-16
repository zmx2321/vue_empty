<template>
  <g-6-tree :params="params" />
</template>

<script>
import G6Tree from './components/g6Tree'

export default {
  name: "reportRrcord",

  components: { G6Tree },

  data() {
    return {
      params: {
        id: this.$route.query.id,
        reportFormNameId: this.$route.query.reportFormNameId,
      }
    }
  }
}
</script>
