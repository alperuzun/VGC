vgc_fisher_test_script = function(matrix_array, num_row, sample_list, gt_list) {
    calculation_matrix <- matrix(matrix_array, nrow = num_row, dimnames = list(Samples = sample_list, Genotypes = gt_list));
    fisher.test(calculation_matrix, simulate.p.value = TRUE, B = 2e4);
}


# VGC <-
#
# matrix(c(2,0,57,54,0,7), nrow=2,
# 	dimnames = list(Samples = c("Controls", "Cases"),
# 					Genotypes = c("0/0", "0/1", "1/1")))
#
# MC4<-fisher.test(VGC, simulate.p.value = TRUE, B = 2e4)

# matrix(c(2,0,57,54,0,7), nrow=2, dimnames = list(Samples = c("Controls", "Cases"), Genotypes = c("0/0", "0/1", "1/1")))
#
# MC4<-fisher.test(VGC, simulate.p.value = TRUE, B = 2e4)