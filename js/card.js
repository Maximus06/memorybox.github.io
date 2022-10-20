// Card Class: Represents a Card
export class Card {
  constructor(
    id,
    question,
    complementQuestion,
    answer,
    complementAnswer,
    sens,
    theme,
    step,
    set,
    color,
    active = true
  ) {
    this.id = id;
    this.question = question;
    this.complementQuestion = complementQuestion;
    this.answer = answer;
    this.complementAnswer = complementAnswer;
    this.sens = sens;
    this.theme = theme;
    this.step = step;
    this.set = set;
    this.active = active;
    this.color = color;
  }
}
