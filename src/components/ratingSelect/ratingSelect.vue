<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
    </div>
    <div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
      <span class="icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  const vm = new Vue()
  const POSITIVE = 0; //正面评价
  const NEGATIVE = 1; //负面评价
  const ALL = 2;      //所有评价
  export default {
    //传进来的内容
    props:{
      ratings:{
        type:Array,
        default(){
          return []
        }
      },
      selectType:{
        type:Number,
        default:ALL
      },
      onlyContent:{
        type:Boolean,
        default:false
      },
      desc:{
        type:Object,
        default(){
          return {
            all:'全部',
            positive:'满意',
            negative:'不满意'
          }
        }
      }
    },
    //在Vue2.0中，实现组件属性的双向绑定方式
    //1.在组件内的data对象中创建一个props属性的副本 mySelectType
    //2. 创建针对props属性的watch来同步组件外对props的修改  mySelectType
    //3. 创建针对props副本的watch，通知到组件外
    data:function () {
//      console.log(this.onlyContent)
      return {
        mySelectType:this.selectType,
        myOnlyContent:this.onlyContent
      }
    },
    methods:{
      select(type,event){
        if(!event._constructed){
          return ;
        }
        this.mySelectType = type
        //派发事件
        //添加这句，提交'ratingtype.select'事情给父组件，第二个是要传递的参数
        this.$emit('ratingtype-select',type)
      },
      toggleContent(event){
        if(!event._constructed){
          return ;
        }
        this.myOnlyContent = !this.myOnlyContent ;
        this.$emit('content-toggle',this.myOnlyContent)
      }
    },
    computed:{
      positives(){
        return this.ratings.filter((rating)=>{
            return rating.rateType === POSITIVE
        })
      },
      negative(){
        return this.ratings.filter((rating)=>{
          return rating.rateType === NEGATIVE
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size: 0
      .block
        display: inline-block
        padding:8px 12px
        margin-right: 8px
        border-radius: 2px
        color: rgb(77,85,93)
        font-size: 12px
        &.active
          color: #fff
        .count
          font-size: 8px
          margin-left: 2px
          line-height: 16px
        &.positive
          background: rgba(0,160,220,0.2)
          &.active
            background:rgb(0,160,220)
        &.negative
          background: rgba(77,85,93,0.2)
          &.active
            background:rgb(77,85,93)
    .switch
      padding:12px 18px
      line-height: 24px
      border-bottom:1px solid rgba(7,17,24,0.1);
      color: rgb(147,153,159)
      font-size:0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align:top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align:top
        font-size: 12px
</style>






















