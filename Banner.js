class Ban {
    constructor(el) {
        this.me = this;
        this.w = this.getW();//获取宽度
        this.el = el;
        this.con = this.el.querySelector('.content ul');
        this.tab = this.el.querySelectorAll('.table');
        this.n = this.tab.length;
        this.current = 0;//当前状态
        this.next = -this.w;//下个状态
        this.speed = 10;//速度
        this.f = 3000;//周期
        this.list = [];//按钮对应位置;
        this.timer = null;
        this.tabClick2 = this.tabClick.bind(this);

        this.addBtn();

        this.timer = setInterval(() => {//入口
            this.turn();
            this.next -= this.w;
            if (this.next <= -(this.n + 1) * this.w || this.next > 0) {
                setTimeout(() => {
                    this.init()
                }, this.f / 5);
            }

        }, this.f);

    }

    getW(){//获取宽度
        let w = parseInt(window.getComputedStyle(document.querySelector('.content')).width)
        return w;
    }


    addBtn() {//给按钮添加事件
        for (let i = 0; i < this.tab.length; i++) {
            this.list[i] = -this.w * i;
            this.tab[i].addEventListener('click', this.tabClick2, false);
        }
    }

    removeBtn() {
        for (let i = 0; i < this.tab.length; i++) {
            this.list[i] = -this.w * i;
            this.tab[i].removeEventListener('click', this.tabClick2, false);
        }
    }

    tabInit() {
        for (let i = 0; i < this.tab.length; i++) {
            this.tab[i].style.background = "#404040";
        }
    }

    tabClick(e) {
        clearInterval(this.timer);
        this.removeBtn();
        let me = e.target;
        let n = null;//获取第几个按钮
        this.tab.forEach(function (item, index) {
            if (item == me) {
                n = index;
            }
        });
        this.next = this.list[n];
        this.turn();
        setTimeout(() => {
            this.timer = setInterval(() => {//入口
                this.turn();
                this.next -= this.w;
                if (this.next <= -(this.n + 1) * this.w || this.next > 0) {
                    setTimeout(() => {
                        this.init()
                    }, this.f / 5);
                }
            }, this.f);
            this.addBtn();
        }, this.f / 5)
    }

    turn() {
        let currSpeed = null;
        let mul = null;
        const theNext = this.next;
        if (this.current > this.next) {//左滑动
            mul = (this.current - this.next) / this.w;
            currSpeed = mul * this.speed;
            let inTimer1 = setInterval(() => {
                this.current -= currSpeed;
                this.con.style.left = this.current + "px";
                if (this.current <= theNext) {
                    clearInterval(inTimer1);
                }
            }, 1)
        } else if (this.next > this.current) {//右滑动
            mul = (this.next - this.current) / this.w;
            currSpeed = mul * this.speed;
            let inTimer2 = setInterval(() => {
                this.current += currSpeed;
                this.con.style.left = this.current + "px";
                if (this.current >= theNext) {
                    clearInterval(inTimer2);
                }
            }, 1);
        }
    }

    init() {
        this.current = 0;
        this.next = -this.w;
    }
}

class Baner {
    constructor(el) {
        this.el = this.isNode(el) ? el : document.querySelector(el);
        if (this.el) {
            let fragment = this.node2Fragment(this.el);
            let wra = this.compile(fragment);
            this.el.appendChild(wra)
            new Ban(this.el);
        }
    }

    isNode(el) {
        return el.nodeType === 1;
    }
    // 以上辅助
    node2Fragment(el) {
        let fragment = document.createDocumentFragment();
        let fChild;
        while (fChild = el.firstChild) {
            fragment.appendChild(fChild);
        }
        return fragment;
    }

    compile(f) {
        let lists = f.children[0].children;
        let leng = lists.length;
        for (let i = 0; i < leng; i++) {
            lists[i].style.cssText = `float:left;width:${100 / (leng + 1)}%;height:100%;`
            lists[i].children[0].style.cssText = `width:100%;height:100%;`//设置图片100%
        }
        let first = lists[0].cloneNode(true);//克隆第一张图片
        let wra = document.createElement('div');//最外层
        wra.style.cssText = "position:relative;width:100%;height:100%;overflow:hidden;"
        let content = document.createElement('div');//内容
        content.className = "content";
        content.style.cssText = "width: 100%;height:100%;"
        let tab = document.createElement('div');//按钮
        wra.appendChild(content);
        wra.appendChild(tab);
        let conUl = document.createElement('ul');//内容ul
        while (lists[0]) {
            conUl.appendChild(lists[0]);
        }
        conUl.appendChild(first);
        conUl.style.cssText = `position:absolute;left:0;top:0;width:${(leng + 1) * 100}%;height:100%;`
        content.appendChild(conUl);
        let tabUl = document.createElement('ul');//按钮ul
        tabUl.style.cssText = `position:absolute;right:0;bottom:7%;width:${(leng + 3) * 14}px;height:15px;`
        for (let i = 0; i < leng; i++) {
            let tmp = document.createElement('li');
            tmp.style.cssText = `float:left;width:10px;height:10px;margin-left:4px;border:1px solid black;border-radius:50%;cursor:pointer;background:#404040;`
            tmp.className = "table";
            tabUl.appendChild(tmp);
        }
        tab.appendChild(tabUl);
        return wra;
    }

}
