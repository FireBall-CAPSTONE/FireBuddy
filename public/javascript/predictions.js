

function pmf(k, lambda){
    exponentialPower = Math.pow(2.718281828, -lambda); // negative power k
    lambdaPowerK = Math.pow(lambda, k); // Landa elevated k
    numerator = exponentialPower * lambdaPowerK;
    denominator = factorial(k); // factorial of k.

    return (numerator / denominator);
}

function cdf(k, lambda){
    total = 0
    for (var i = 0; i < k; i++) {
        total += pmf(i, lambda);
    }
    return total
}

function factorial(x) {
   if(x==0) {
      return 1;
   }
   return x * factorial(x-1);
}

function compute(form) {
    Day = new Date(eval(form.day.value))
    K = eval(form.k.value)

    const diffDays = Math.ceil(new Date(2022-10-28) - Day / (1000 * 60 * 60 * 24))
    lambda = diffDays * 0.09124051630702533
	if (lambda<=0) {
		alert("Number of Fireballs must be positive.");
	} else if (K<0) {
		cdf=0
	} else {
		K = Math.floor(K)
		cdf = 1-cdf(K-1, lambda);
		pmf = pmf(K, lambda) ;
	}
	cdf = Math.round(cdf*100000)/100000;
	pmf = Math.round(pmf*100000)/100000;

    form.result1.value = cdf;
    form.result2.value = pmf;
}


