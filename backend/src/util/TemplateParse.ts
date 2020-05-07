/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/no-explicit-any */
class TemplateParse {
  private evaluateString(string: string, _options: any[]): string {
    return string.replace(/{{=([^}]*)}}/g, (tmp, value) => eval(value));
  }

  private replaceGivenObject(string: string, options: any[]): string {
    const _values: object = (options && options.values) || {};

    return string.replace(/{{\s*([^}]*)\s*}}/g, (m, $1: string) => {
      return _values[$1.trim()];
    });
  }

  private replaceGivenArray = (string: string, options: any[]): string => {
    const _array = (options && options.array) || [];

    return string.replace(/{{\s*(\d+)\s*}}/g, function (m, $1) {
      return _array[$1];
    });
  };

  public format(string: string, options: any[]) {
    /* eslint-disable no-param-reassign */
    string = this.evaluateString(string, options);
    string = this.replaceGivenArray(string, options);
    string = this.replaceGivenObject(string, options);
    return string;
  }
}

export default TemplateParse;
