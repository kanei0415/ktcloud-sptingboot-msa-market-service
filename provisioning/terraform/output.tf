output "ap-northeast-2a-bastion-node-ip" {
  description = "ap-northeast-2aのBastionのパブリックIP"
  value       = aws_instance.ap-northeast-2a-bastion-node.public_ip
}

output "ap-northeast-2b-bastion-node-ip" {
  description = "ap-northeast-2bのBastionのパブリックIP"
  value       = aws_instance.ap-northeast-2b-bastion-node.public_ip
}

output "ap-northeast-2a-master-node-01-internal-ip" {
  description = "ap-northeast-2aのMaster Node 01のプライベートIP"
  value       = aws_instance.ap-northeast-2a-master-node-01.private_ip
}

output "ap-northeast-2a-master-node-02-internal-ip" {
  description = "ap-northeast-2aのMaster Node 02のプライベートIP"
  value       = aws_instance.ap-northeast-2a-master-node-02.private_ip
}

output "ap-northeast-2a-worker-node-01-internal-ip" {
  description = "ap-northeast-2aのWorker Node 01のプライベートIP"
  value       = aws_instance.ap-northeast-2a-worker-node-01.private_ip
}

output "ap-northeast-2b-master-node-01-internal-ip" {
  description = "ap-northeast-2bのMaster Node 01のプライベートIP"
  value       = aws_instance.ap-northeast-2b-master-node-01.private_ip
}

output "ap-northeast-2b-worker-node-01-internal-ip" {
  description = "ap-northeast-2bのWorker Node 01のプライベートIP"
  value       = aws_instance.ap-northeast-2b-worker-node-01.private_ip
}

output "ap-northeast-2b-worker-node-02-internal-ip" {
  description = "ap-northeast-2bのWorker Node 02のプライベートIP"
  value       = aws_instance.ap-northeast-2b-worker-node-02.private_ip
}
