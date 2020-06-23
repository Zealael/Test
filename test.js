// invoices.json
const data = [
	{
		customer: "MDT",
		performance: [
			{
				playId: "Гамлет",
				audience: 55,
				type: "tragedy"
			},
			{
				playId: "Ромео и Джульетта",
				audience: 35,
				type: "tragedy"
			},
			{
				playId: "Отелло",
				audience: 40,
				type: "comedy"
			}
		]
	},
	{
		customer: "MGM",
		performance: [
			{
				playId: "Tom",
				audience: 50,
				type: "tragedy"
			},
			{
				playId: "Spike",
				audience: 45,
				type: "tragedy"
			},
			{
				playId: "Jerry",
				audience: 50,
				type: "comedy"
			}
		]
	},
	{
		customer: "Disney",
		performance: [
			{
				playId: "Duck Tales",
				audience: 10,
				type: "comedy"
			},
			{
				playId: "Darkwing",
				audience: 5,
				type: "tragedy"
			},
			{
				playId: "Quack Pack",
				audience: 37,
				type: "comedy"
			}
		]
	}
]

function statement(invoices) {
    let totalAmount = 0
	  ,	volumeCredits = 0
	  , minPositions = 30
	  ,	result = ``;
		
    const format = new Intl.NumberFormat("ru-RU",
		{style: "currency", currency: "RUB",
			minimumFractionDigits: 2 }).format;	
	
	for (let invoice of invoices) {
		result += `Счет для ${invoice.customer}\n`;
		
		for (let perf of invoice.performance) {
			const play = perf.playId;		
			let thisAmount = 0;
			
			switch (perf.type) {
				case "tragedy":
					thisAmount = calcTragedyAmount(thisAmount, perf.audience)
					break;
				case "comedy":
					thisAmount = calcComedyAmount(thisAmount, perf.audience);
					break;
				default:
					throw new Error(`неизвестный тип: ${play.type}`);
			}
		
			totalAmount += thisAmount;
		
			//Добавление бонусов
			volumeCredits += Math.max(perf.audience - minPositions, 0);

			// Дополнительный бонус за каждые 10 комедий
			if ( play.type == "comedy") volumeCredits += Math.floor(perf.audience / 10);
	
			result = getResultPerformanceMessage(format, result, perf.playId, thisAmount, perf.audience);
		}
		
		result = getResultTotalPerformanceMessage(format, result, totalAmount, volumeCredits);
		
		volumeCredits = totalAmount = 0;
	}
	
    return result;
}

//Функции
function calcTragedyAmount (thisAmount, perfAudience){
	const TRAGEDY_AMOUNT = 40000
		, TRAGEDY_AUDIENCE = 30
		, TRAGEDY_MULTIPLIER = 1000;
	
	thisAmount = TRAGEDY_AMOUNT;
	if (perfAudience > TRAGEDY_AUDIENCE) {
				thisAmount += TRAGEDY_MULTIPLIER * (perfAudience - TRAGEDY_AUDIENCE);
	}
	
	return thisAmount;
}

function calcComedyAmount (thisAmount, perfAudience){
	const COMEDY_AMOUNT = 30000
		, COMEDY_AUDIENCE = 20
		, COMEDY_BASE_PRICE = 10000
		, COMEDY_MULTIPLIER = 500
		, COMEDY_ADDITIONAL_MULTIPLIER = 300;
		
	thisAmount = COMEDY_AMOUNT;
	if (perfAudience > COMEDY_AUDIENCE)  {
			thisAmount += COMEDY_BASE_PRICE + COMEDY_MULTIPLIER * (perfAudience - COMEDY_AUDIENCE);
	}
	thisAmount += COMEDY_ADDITIONAL_MULTIPLIER * perfAudience;
	
	return thisAmount;
}

function getResultPerformanceMessage(format, result, playId, thisAmount, perfAudience) {
	
	result += `  ${playId}: ${format(thisAmount / 100)}`;
	result += `  (${perfAudience} мест)\n`;
	
	
	return result;
}

function getResultTotalPerformanceMessage(format, result, totalAmount, volumeCredits) {
	
	result += `Итого с вас ${format(totalAmount/100)}\n`;
	result += `Вы заработали ${volumeCredits} бонусов\n`;
	
	return result;
}