class StringFormat {
  static toSentenceCase(str: string): string {
    if (str) {
      let words: string[] = str.toLowerCase().split("_");
      let sentenceCaseWords: string[] = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      return sentenceCaseWords.join(" ");
    }

    return "";
  }

  static toTitleCase(str: string): string {
    if (str) {
      let words: string[] = str.toLowerCase().split("_");
      let titleCaseWords: string[] = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1)
      );
      return titleCaseWords.join(" ");
    }

    return "";
  }

  static toTitleCase2(input: string): string {
    return input.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  static toLowerCase(str: string): string {
    return str?.toLowerCase();
  }

  static replaceCharacter(
    str: string,
    oldChar: string,
    newChar: string
  ): string {
    return str.replace(new RegExp(oldChar, "g"), newChar);
  }

  static convertToTitleCase2(input: string): string {
    let converted = input
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, function (str) {
        return str.toUpperCase();
      })
      .replace(/^Sub/, "Sub-");

    const hyphenIndex = converted.indexOf("-");
    if (hyphenIndex !== -1 && hyphenIndex + 1 < converted.length) {
      converted =
        converted.slice(0, hyphenIndex + 1) +
        converted[hyphenIndex + 1].toUpperCase() +
        converted.slice(hyphenIndex + 2);
    }

    if (converted.endsWith(" Name")) {
      converted = converted.slice(0, converted.length - 5);
    }

    return converted;
  }

  static getCharacter(str: string, length: number): string {
    return str?.substring(0, length);
  }

  static Currency(
    currencyValue: number | string,
    currencySign?: string
  ): string {
    if (!currencyValue || currencyValue === null || currencyValue === "") {
      return "";
    }

    const formattedCurrency = currencyValue.toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
    });

    return currencySign
      ? `${currencySign}${formattedCurrency}`
      : `${formattedCurrency}`;
  }

  static formatNumber(
    numberValue: number | string,
    currencySign?: string
  ): string {
    if (!numberValue || numberValue === null || numberValue === "") {
      return "-";
    }

    const options = {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    };

    const formattedNumber = Number(numberValue).toLocaleString(
      "en-NG",
      options
    );

    if (formattedNumber.includes("-")) {
      return `(${formattedNumber.replace("-", "")})`;
    }

    return currencySign ? `${currencySign}${formattedNumber}` : formattedNumber;
  }
}

export default StringFormat;
