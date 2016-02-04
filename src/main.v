// Generated verilog

module andx (input a, b, output o);
assign o = a & b;
endmodule

module driver #(parameter B = 1'b0)(output o);
assign o = B;
endmodule

module main(output output13);
wire w0;
wire w1;
wire w2;
assign output13 = w2;
andx andx10 (
  .a(w0),
  .b(w1),
  .o(w2)
);
driver #(
  .B(1'b0)
 )
 driver11 (
  .o(w0)
);
driver #(
  .B(1'b1)
 )
 driver12 (
  .o(w1)
);
endmodule
