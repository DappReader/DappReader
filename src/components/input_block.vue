<template>
  <el-dialog
    title="当前链错误"
    :visible.sync="dialogVisible"
    width="400"
    :before-close="handleClose">
    
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span> -->
  </el-dialog>
</template>
<script>

export default {
  props: ['dialogVisible'],
  data() {
    return {
      
    };
  },
  methods: {
    
  },
  computed: {
    
  },

};
</script>
<style lang="scss">
.input-block {
  .input {
    margin-bottom: 10px;
  }
}
</style>
