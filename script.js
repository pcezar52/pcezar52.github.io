var listaX = [];
var listaY = [];
var listaZ = [];
var flagX = false; ////
var flagY = false; ////
var flagZ = false; ////
var flagConfirm = false; /////
var retas = []; 
var pontos_fuga =[]; 
var ortocentros = [];
var ortocentros_retas = [];
var lista_Ps = [];

var imagem = document.getElementById("imagem");
var ctximagem = imagem.getContext("2d");
    
var imgOriginal = new Image();

imgOriginal.crossOrigin = '';
    
imgOriginal.src = "midou1.jpg";
imgOriginal.onload = function(){
w=2*imgOriginal.width;
h=2*imgOriginal.height;
ctximagem.drawImage(imgOriginal, 0, 0,w,h);  };


document.getElementById("bt_guiaX").addEventListener("click", function () {
	flagX=true;
	flagY=false;
	flagZ=false;
});

document.getElementById("bt_guiaY").addEventListener("click", function () {
	flagY=true;
	flagX=false;
	flagZ=false;
});

document.getElementById("bt_guiaZ").addEventListener("click", function () {
	flagZ=true;
	flagY=false;
	flagX=false;
});

document.getElementById("bt_confirm").addEventListener("click", function () {
	flagZ=false;
	flagY=false;
	flagX=false;
	flagConfirm=true;

	if (listaX.length==4 && listaY.length==4 && listaZ.length==4 && flagConfirm==true){

		//calculando as retas a*u+b*v+z=0
		for(let i=0; i< 3; i++){
			retas.push(coeficientes_reta(listaX[i],listaX[i+1]));
			i+=1;
		};

		for(let i=0; i< 3; i++){
			retas.push(coeficientes_reta(listaY[i],listaY[i+1]));
			i+=1;
		};

		for(let i=0; i< 3; i++){
			retas.push(coeficientes_reta(listaZ[i],listaZ[i+1]));
			i+=1;
		};

		//pontos de fuga
		for (i=0; i< Math.floor(retas.length/2)*2; i++){
			pontos_fuga.push(intersecao_retas(retas[i],retas[i+1]));
			i+=1;
		};
		
		let X_m = pontos_fuga[1][0];
		let X_n = pontos_fuga[2][0];
		let X_p = pontos_fuga[0][0];
		let Y_m = pontos_fuga[1][1];
		let Y_n = pontos_fuga[2][1];
		let Y_p = pontos_fuga[0][1];
		let t = ((X_m-X_n)*(X_p-X_n)+(Y_m-Y_n)*(Y_p-Y_n))/((X_m-X_n)*(X_m-X_n)+(Y_m-Y_n)*(Y_m-Y_n));
		let P2 = [(X_m-X_n)*t+X_n,(Y_m-Y_n)*t+Y_n];
		lista_Ps.push(P2);
		X_m = pontos_fuga[2][0];
		X_n = pontos_fuga[0][0];
		X_p = pontos_fuga[1][0];
		Y_m = pontos_fuga[2][1];
		Y_n = pontos_fuga[0][1];
		Y_p = pontos_fuga[1][1];
		t = ((X_m-X_n)*(X_p-X_n)+(Y_m-Y_n)*(Y_p-Y_n))/((X_m-X_n)*(X_m-X_n)+(Y_m-Y_n)*(Y_m-Y_n));
		P3 = [(X_m-X_n)*t+X_n,(Y_m-Y_n)*t+Y_n];
		lista_Ps.push(P3);
			
		X_m = pontos_fuga[0][0];
		X_n = pontos_fuga[1][0];
		X_p = pontos_fuga[2][0];
		Y_m = pontos_fuga[0][1];
		Y_n = pontos_fuga[1][1];
		Y_p = pontos_fuga[2][1];
		t = ((X_m-X_n)*(X_p-X_n)+(Y_m-Y_n)*(Y_p-Y_n))/((X_m-X_n)*(X_m-X_n)+(Y_m-Y_n)*(Y_m-Y_n));
		P1 = [(X_m-X_n)*t+X_n,(Y_m-Y_n)*t+Y_n]; 
		lista_Ps.push(P1);
			
		for(i=0; i< 3; i++){
			ortocentros_retas.push(coeficientes_reta(pontos_fuga[i],lista_Ps[i]));
		};
		//pontos de fuga
		for (i=0; i<2; i++){
			//coordenada u de intersecção u=(c_2*b_1-c_1*b_2)/(a_1*b_2-a_2*b_1)
			ortocentros.push(intersecao_retas(ortocentros_retas[i],ortocentros_retas[i+1]));
		};
			
		ortocentros.push(intersecao_retas(ortocentros_retas[2],ortocentros_retas[0]));
	
			
		for(let i=0;i<ortocentros.length;i++){
			desenha_ponto(ortocentros[i][0],ortocentros[i][1],7,"orange");
		};
	};
});

document.getElementById("bt_guiaX").addEventListener("click", function () {
	flag1=true;
});

//panel.offsetLeft-pageXoffset
//panel.offsetTop-pageYoffset
imagem.addEventListener("click", function () {

	//Coleta/armazena os dados dos pontos
	if (flagX==true){
		if(event.pageY>200){
			//console.log("Click!" + event.pageX + " " +event.pageY);
			listaX.push([event.pageX-imagem.offsetLeft,event.pageY-imagem.offsetTop]);
		};
		if(listaX.length>=4){
			flagX=false
		};
	};

	if (flagY==true){
		if(event.pageY>200){
			//console.log("Click!" + event.pageX + " " +event.pageY);
			listaY.push([event.pageX-imagem.offsetLeft,event.pageY-imagem.offsetTop]);
		};
		if(listaY.length>=4){
			flagY=false
		};
	};

	if (flagZ==true){
		if(event.pageY>200){
			//console.log("Click!" + event.pageX + " " +event.pageY);
			listaZ.push([event.pageX-imagem.offsetLeft,event.pageY-imagem.offsetTop]);
		};
		if(listaZ.length>=4){
			flagZ=false
		};
	};


	//Desenha pontos
	if (listaX.length>0 && listaX.length<=4){
		for(i=0; i<listaX.length; i++){
			desenha_ponto(listaX[i][0], listaX[i][1], 3,"black");
		};
	};

	if (listaY.length>0 && listaY.length<=4){
		for(i=0; i<listaY.length; i++){
			desenha_ponto(listaY[i][0], listaY[i][1], 3,"black");
		};
	};

	if (listaZ.length>0 && listaZ.length<=4){
		for(i=0; i<listaZ.length; i++){
			desenha_ponto(listaZ[i][0], listaZ[i][1], 3,"black");
		};
	};
	
	
	//Desenha os segmentos
	if (listaX.length>1){	
		for(let i=0; i< Math.floor(listaX.length/2)*2; i++){
			desenha_segmento(listaX[i],listaX[i+1],"Red");
			i+=1;
		};
	};

	if (listaY.length>1){	
		for(let i=0; i< Math.floor(listaY.length/2)*2; i++){
			desenha_segmento(listaY[i],listaY[i+1],"Blue");
			i+=1;
		};
	};

	if (listaZ.length>1){	
		for(let i=0; i< Math.floor(listaZ.length/2)*2; i++){
			desenha_segmento(listaZ[i],listaZ[i+1],"Green");
			i+=1;
		};
	};
});



		

/*Função que recebe como entrada duas listas com as coordenadas de um ponto e,
retorna os coeficientes addEventListener, b, c da reta (a*x+b*y+c=0) gerada por esses pontos_fuga.*/
function coeficientes_reta(A,B){
	let coeficiente_a = A[1]-B[1];
	let coeficiente_b = -A[0]+B[0];
	let coeficiente_c = (A[0]*B[1]-A[1]*B[0]);
	return [coeficiente_a,coeficiente_b,coeficiente_c]
};

function desenha_segmento(A,B,cor){
	ctximagem.strokeStyle = cor;
	ctximagem.lineWidth = 3;
	ctximagem.beginPath();
	ctximagem.moveTo(A[0],A[1]);
	ctximagem.lineTo(B[0],B[1]);
	ctximagem.stroke();
};

function desenha_ponto(cx,cy,raio,cor){
	ctximagem.beginPath();
	ctximagem.arc(cx,cy, raio, 0, Math.PI * 2, false);
	ctximagem.fillStyle = cor;
	ctximagem.fill();
};

/* Função que recebe como parâmetro duas listas, onde cada uma contém,
os coeficientes a, b, c de uma reta do tipo a*x+b*y+c=0. E tem como saída uma lista
[P_x,P_y], que são as coordenadas dos pontos de interseção da retas*/
function intersecao_retas(coeficientes_reta_1,coeficientes_reta_2){
	let P_x = (coeficientes_reta_2[1]*coeficientes_reta_1[2]-coeficientes_reta_1[1]*coeficientes_reta_2[2])/
	(coeficientes_reta_2[0]*coeficientes_reta_1[1]-coeficientes_reta_1[0]*coeficientes_reta_2[1]);  
	let P_y = -(coeficientes_reta_1[0]*P_x+coeficientes_reta_1[2])/coeficientes_reta_1[1];
	let aux = -(coeficientes_reta_2[0]*P_x+coeficientes_reta_2[2])/coeficientes_reta_2[1];
	return([P_x,P_y]);
};
