<template>
  <div @keydown.enter.prevent="submit_model">
    <el-dialog title="添加文件夹" :visible.sync="show_dialog">
      <el-form :model="form" ref="form">
        <el-form-item label="文件夹名称" prop="name" label-width="100px"
        :rules="[
          { required: true, message: '请输入文件夹名称', trigger: 'blur' },
        ]">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="show_dialog = false">取 消</el-button>
        <el-button type="primary" @click="submit_model">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show_dialog: false,
      form: {
        name: ""
      },
    }
  },
  methods: {
    open() {
      this.show_dialog = true;
    },
    submit_model() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let formData = this.form;
          formData.son = []
          this.$emit('add', formData)
          this.form = {
            name: ''
          };
          this.show_dialog = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
}
</script>
<style lang="scss" scoped>

</style>