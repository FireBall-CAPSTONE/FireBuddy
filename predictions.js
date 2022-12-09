var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();

if (dd < 10) {
   dd = '0' + dd;
}

if (mm < 10) {
   mm = '0' + mm;
}

today = yyyy + '-' + mm + '-' + dd;
document.getElementById("day").setAttribute("min", today);


function LogGamma(Z) {
	with (Math) {
		var S=1+76.18009173/Z-86.50532033/(Z+1)+24.01409822/(Z+2)-1.231739516/(Z+3)+.00120858003/(Z+4)-.00000536382/(Z+5);
		var LG= (Z-.5)*log(Z+4.5)-(Z+4.5)+log(S*2.50662827465);
	}
	return LG
}

function Gcf(X,A) {        // Good for X>A+1
	with (Math) {
		var A0=0;
		var B0=1;
		var A1=1;
		var B1=X;
		var AOLD=0;
		var N=0;
		while (abs((A1-AOLD)/A1)>.00001) {
			AOLD=A1;
			N=N+1;
			A0=A1+(N-A)*A0;
			B0=B1+(N-A)*B0;
			A1=X*A0+N*A1;
			B1=X*B0+N*B1;
			A0=A0/B1;
			B0=B0/B1;
			A1=A1/B1;
			B1=1;
		}
		var Prob=exp(A*log(X)-X-LogGamma(A))*A1;
	}
	return 1-Prob
}

function Gser(X,A) {        // Good for X<A+1.
    with (Math) {
		var T9=1/A;
		var G=T9;
		var I=1;
		while (T9>G*.00001) {
			T9=T9*X/(A+I);
			G=G+T9;
			I=I+1;
		}
		G=G*exp(A*log(X)-X-LogGamma(A));
    }
    return G
}

function Gammacdf(x,a) {
	var GI;
	if (x<=0) {
		GI=0
	} else if (x<a+1) {
		GI=Gser(x,a)
	} else {
		GI=Gcf(x,a)
	}
	return GI
}

function compute(form) {
    Day = new Date(eval(form.day.value))
    K = eval(form.k.value)

    const diffDays = Math.ceil(new Date(2022-10-28) - Day / (1000 * 60 * 60 * 24))
    Lam = diffDays * 0.09124051630702533
	if (Lam<=0) {
		alert("Lambda must be positive.");
	} else if (K<0) {
		Poiscdf=0
	} else {
		K = Math.floor(K)
		cdf = 1-Gammacdf(Lam,K+1);
		pmf = (1-Gammacdf(Lam,K+2)) - (1-Gammacdf(Lam,K+1)) ;
	}
	cdf = Math.round(cdf*100000)/100000;
	pmf = Math.round(pmf*100000)/100000;

    form.result1.value = cdf;
    form.result2.value = pmf;
}


