<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="selectFood(food,$event)" v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width='57px' :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food = "food" @cart-add="_drop"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!--起送费和配送费   v-ref="shopcart" 父组件访问子组件-->
    <shopcart ref="shopcarts" :select-foods = 'selectFoods' :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    <food :food="selectedFood" ref="food"></food>
  </div>

</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart'
  import cartcontrol from '../cartcontrol/cartcontrol';
  import food from '../food/food';

  const ERR_OK = 0;
  export default {
    props:{
      seller:{
        type:Object
      }
    },
    data(){
      return {
        goods:[],
        listHeight:[],
        scrollY:'',
        selectedFood:{}
      };
    },
    computed: {
      currentIndex(){
        for (let i=0;i<this.listHeight.length;i++){
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i+1];
          if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
            return i;
          }
        }
        return 0;
      },
      selectFoods(){
        let foods = [];
        this.goods.forEach((good)=>{
          good.foods.forEach((food)=>{
            if(food.count){
              foods.push(food);
            }
          })
        })
        return foods;
      }
    },
    created(){
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
      this.$http.get('/api/goods').then((response)=>{
        response = response.body;
        if(response.errno === ERR_OK){
          this.goods = response.data;
//          初始化页面高度
          this.$nextTick(()=>{
            this._initScroll();
            this._calculateHeight();//实时计算高度
          })
        }
      });
      this.$on('cart.add',this._drop)
    },
    methods:{
//      这个函数是上滑查看的操作   滚动
      _initScroll(){
        this.menuScroll = new BScroll(this.$refs.menuWrapper,{
          click:true  //不传的话  点击事件绑定不上
        });
        this.foodsScroll = new BScroll(this.$refs.foodWrapper,{
          click:true,
          //探针的效果
          probeType:3
        });
        //监听滚动事件
        this.foodsScroll.on('scroll',(pos)=>{
          this.scrollY =Math.abs( Math.round(pos.y));
        })
      },
      _calculateHeight(){
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for(let i=0;i<foodList.length;i++){
          let item = foodList[i];
          height += item.clientHeight; //每个li的高度相加
          this.listHeight.push(height);
        }
      },
      selectMenu(index,event){
        if(!event._constructed){
          return ;
        }
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el,300);
      },
      _drop(target){
        //父组件 访问子组件
        //console.log('drop')
        //体验优化，异步执行下落动画
        this.$nextTick(()=>{
          this.$refs.shopcarts.drop(target)
        })
      },
      selectFood(food,event){
        if(!event._constructed){
          return ;
        }
        this.selectedFood = food;
        //父组件调用子组件的方法
        this.$refs.food.show()
      }
    },
//    注册组件
    components:{
      shopcart,cartcontrol,food
    },
//    events:{
//      'cart.add'(target) {
//        this._drop(target)
//      }
//    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .goods
    display: flex
    position: absolute
    top: 174px /*header的高度*/
    bottom: 46px /*购物车栏的高度*/
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex:0 0 80px
      width: 80px   /*处理兼容性问题*/
      background: #f3f5f7
      .menu-item
        display: table   /*垂直居中*/
        width: 56px
        height: 54px
        line-height: 14px
        padding:0 12px
        &.current
          position: relative
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
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
          display: table-cell
          width: 56px
          vertical-align: middle
          border-1px(rgba(7,17,27,0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left:2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px    /*图标大小固定*/
          margin-right: 10px
        .content
          flex: 1          /*右侧内容宽度自适应*/
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7,17,27)
          .desc,.extra
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .desc
            line-height: 15px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 18px
              font-size: 14px
              color: rgb(240,20,20)
            .old
              text-decoration:line-through
              font-size: 10px
              color: rgb(147,153,159)
          .cartcontrol-wrapper
            position: absolute;
            right: 0
            bottom: 12px;
</style>


















