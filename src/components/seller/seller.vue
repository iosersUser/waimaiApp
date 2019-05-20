<template>
  <div class="seller" ref="sellerRef">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{sellers.name}}</h1>
        <div class="desc">
          <star :size="36" :score="sellers.score"></star>
          <span class="ratingCount">({{sellers.ratingCount}})</span>
          <span class="sellCount">月售{{sellers.sellCount}}单</span>
          <div class="favorite">
            <span class="icon-favorite" @click="toggleFavorite" :class="favorite ? 'active' : ''"></span>
            <span class="text">{{this.favoriteText}}</span>
          </div>
        </div>
        <ul class="remark">
          <li class="block"><h2>起送价</h2><span class="content">{{sellers.minPrice}}</span><span class="unit">元</span></li>
          <li class="block"><h2>商家配送</h2><span class="content">{{sellers.deliveryPrice}}</span><span class="unit">元</span></li>
          <li class="block"><h2>平均配送时间</h2><span class="content">{{sellers.deliveryTime}}</span><span class="unit">分钟</span></li>
        </ul>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="desc">{{sellers.bulletin}}</div>
        <ul class="supports">
          <li class="supports-item border-1px" v-for="item in sellers.supports">
            <span class="icon" :class="classMap[item.type]"></span>
            <!--<span class="icon">{{item.type}}</span>-->
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <div class="split"></div>
      <div class="pics">
        <h2 class="title">商家实景</h2>
        <div class="picsWrapper" ref="picsWrapper">
          <ul class="pics-items" ref="picList">
            <li class="pics-item" v-for="item in sellers.pics" >
              <img :src="item" alt="" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <div class="split"></div>
      <div class="info">
        <h2 class="title border-1px">商家信息</h2>
        <ul class="info-wrapper">
          <li class="info-item border-1px" v-for="item in sellers.infos">{{item}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import star from '../star/star.vue'
  import split from '../split/split.vue'
  import {saveToLocal,loadFromLocal} from '../../common/js/store'
  const ERR_OK = 0
  export default {
    data(){
      return {
        sellers:[],
        favorite:false
      }
    },
    created(){
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
      this.$http.get('/api/seller').then((response)=>{
        response = response.body
        if(response.errno === ERR_OK){
          this.sellers = response.data
          this._initPics();
        }
      })
      this.favorite = loadFromLocal(this.sellers.id,'favorite')
    },
    ready(){
      this._initScroll()
      this._initPics()
    },
    methods:{
      toggleFavorite(e){
        if(e._constructed){
          return ;
        }
        this.favorite = !this.favorite
        saveToLocal(this.sellers.id,'favorite',this.favorite)
      },
      _initScroll(){
        if(this.scroll){
          this.scroll.refresh()
        }else{
          this.$nextTick(()=>{
            this.scroll = new BScroll(this.$refs.sellerRef,{
              click:true
            })

          })
        }
      },
      _initPics(){
        if (this.sellers.pics) {
          let picWidth = 120;
          let margin = 6;
          let width = (picWidth + margin) * this.sellers.pics.length - margin;
          this.$refs.picList.style.width = width + 'px';
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picsWrapper, {
                scrollX: true,
                eventPassthrough: 'vertical'
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      }
    },
    computed:{
      favoriteText(){
        return  this.favorite ? '已收藏' : '收藏'
      }
    },
    components:{
      star,split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .seller
    .overview
      position:relative;
      padding: 18px
      .title
        font-size: 14px
        line-height: 14px
        color:rgb(7,17,27)
      .desc
        margin: 8px 0 18px 0
        .star
          display: inline-block
        .ratingCount,.sellCount
          font-size: 10px
          line-height: 18px
          color: rgb(77,85,93)
        .ratingCount
          margin:0 12px 0 8px
        .favorite
          position: absolute
          top: 18px
          right: 18px
          .icon-favorite
            display: block
            text-align: center
            font-size:24px
            line-height: 24px
            color:#d4d6d9
            margin-bottom: 4px
          .active
            color: rgb(240,20,20)
          .text
            font-size: 10px
            line-height: 10px
            color:rgb(77,85,93)
            margin-top: 4px
      .remark
        padding: 18px 0 18px 0
        border-top:1px solid rgba(7,17,27,0.1)
        font-size:0
        display: flex
        flex-direction:row
        align-items: center
        .block:nth-child(2)
          border-left:1px solid rgba(7,17,27,0.1)
          border-right:1px solid rgba(7,17,27,0.1)
        .block
          font-size: 10px
          width: 30%
          text-align:center
          h2
            line-height: 10px
            color: rgb(147,153,159)
            margin-bottom: 4px
          .content,.unit
            font-size: 24px
            line-height: 24px
            font-weight: 200
            color: rgb(7,17,27)
          .unit
            font-size: 10px
    .bulletin
      padding: 18px 18px 0 18px
      .title
        font-size: 14px
        line-height: 14px
        color:rgb(7,17,27)
      .desc
        font-size: 12px
        line-height: 24px
        color: rgb(240,20,20)
        font-weight: 200
        padding: 8px 12px 18px
        border-bottom:1px solid rgba(7,17,27,0.1)
      .supports
        .supports-item
          border-1px(rgba(7,17,27,0.1))
          padding: 18px 12px
          .icon
            width: 16px
            height: 16px
            display: inline-block
            vertical-align: top
            background-size: 16px 16px
            background-repeat :no-repeat
            &.decrease
              bg-image('decrease_3')
            &.discount
              bg-image('discount_3')
            &.guarantee
              bg-image('guarantee_3')
            &.invoice
              bg-image('invoice_3')
            &.special
              bg-image('special_3')
          .text
            font-size: 12px
            line-height: 16px
            font-weight: 200
            color: rgb(7,17,27)
            margin-left: 6px

          &:last-child
            border-none()
    .pics
      padding: 18px
      .title
        font-size: 14px
        line-height: 14px
        color:rgb(7,17,27)
        margin-bottom: 12px
      .picsWrapper
        width: 100%
        overflow: hidden
        white-space:nowrap
        .pics-items
          .pics-item
            display: inline-block
            margin-right: 6px
            width: 120px;
            height: 90px
    .info
      padding: 18px
      .title
        font-size: 14px
        line-height: 14px
        color:rgb(7,17,27)
        padding-bottom: 12px
        border-1px(rgba(7,17,27,0.1))
      .info-item
        border-1px(rgba(7,17,27,0.1))
        padding: 18px 12px
        font-size: 12px
        line-height: 16px
        font-weight: 200
        color: rgb(7,17,27)
        &:last-child
          border-none()
</style>






















