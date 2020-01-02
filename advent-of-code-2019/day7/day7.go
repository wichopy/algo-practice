package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func check(e error) {
	if e != nil {
		panic(e)
	}
}

func main() {
	dat, err := ioutil.ReadFile("./day7.txt")
	check(err)

	instructions := strings.Split(string(dat), ",")
	fmt.Printf("%v", instructions)
}

func parseOpcode(operation string) (opcode, operand1, operand2, operand3 string){
	operand1 := 
}
func IntMachine(inputs []string, instructions []string) {

}