resource "local_file" "ansible_inventory" {
  content = templatefile("inventory.tftpl", {
    bastion_a_ip                   = aws_instance.ap-northeast-2a-bastion-node.public_ip
    bastion_b_ip                   = aws_instance.ap-northeast-2b-bastion-node.public_ip
    ap-northeast-2a-master-node-01 = aws_instance.ap-northeast-2a-master-node-01.private_ip
    ap-northeast-2a-master-node-02 = aws_instance.ap-northeast-2a-master-node-02.private_ip
    ap-northeast-2a-worker-node-01 = aws_instance.ap-northeast-2a-worker-node-01.private_ip
    ap-northeast-2b-master-node-01 = aws_instance.ap-northeast-2b-master-node-01.private_ip
    ap-northeast-2b-worker-node-01 = aws_instance.ap-northeast-2b-worker-node-01.private_ip
    ap-northeast-2b-worker-node-02 = aws_instance.ap-northeast-2b-worker-node-02.private_ip
  })
  filename = "${path.module}/../ansible/inventory.ini"
}
