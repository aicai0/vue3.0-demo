const koa = require('koa')

const fs = require('fs')
const path = require('path')
const compileSfc = require('@vue/compiler-sfc') // 单文件
const compileDom = require('@vue/compiler-dom')  //模版


const app = new koa();
function rewriteImport(content){
    return content.replace(/from ['|"]([^'|"]+)['|"]/g, function(s0,s1){
        console.log(s1)
        // . ../ 开头的都是相对路径
        if(s1[0] !== '.' && s1[1] !== '/'){
            return `from '/@modules/${s1}'`
        }else{
            return s0;
        }
    })
}
app.use(async ctx=>{
    ctx.body = 'hello'
    const {request} =  ctx;
    const {url} = request;
    if(url === '/'){
        ctx.type = 'text/html'
        ctx.body= fs.readFileSync('./index.html','utf-8')
    }else if(url.endsWith('.js')){
        console.log('js文件，额外处理')
        const p = path.resolve(__dirname, url.slice(1))
        ctx.type = 'application/javascript'
        const ret = fs.readFileSync(p,'utf-8')
        ctx.body = rewriteImport(ret);
    }else if(url.startsWith('/@modules/')){
        const prefix = path.resolve(__dirname,'node_modules', url.replace('/@modules/',''));
        console.log(prefix)
        const module = require(prefix+'/package.json').module;
        const p = path.resolve(prefix, module);
        const ret = fs.readFileSync(p,'utf-8')
        ctx.type = 'application/javascript'
        ctx.body = rewriteImport(ret)

    }else if(url.indexOf('.vue')>-1){
        // vue单文件组件
        const p = path.resolve(__dirname, url.split('?')[0].slice(1))
        const {descriptor} = compileSfc.parse(fs.readFileSync(p,'utf-8'))
        
        // 借用vue自带的compile框架解析单文件组件 相当于vue-loader
        if(!request.query.type){
            ctx.type = 'application/javascript'
            ctx.body = `
                const _script = ${descriptor.script.content.replace('export default ', '').replace(/\n/,'')}
                import { render as _render } from "${url}?type=template"
                _script.render = _render
                export default _script
            `
        }else if(request.query.type === 'template'){
            const template = descriptor.template
            const render = compileDom.compile(template.content,{mode:'module'}).code
            ctx.type = 'application/javascript'
            ctx.body = rewriteImport(render)
        }
        
        
    }
})
app.listen(3000,()=>{
    console.log('监听成功3000')
})
// 1.能够访问html文件
// webpack全量打包 vite用到啥 import啥  vite开发环境 build还是webpack
